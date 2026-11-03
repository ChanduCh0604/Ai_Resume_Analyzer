
package com.chandu.ResumeAnalyzer.ServiceImplementation;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.chandu.ResumeAnalyzer.Repo.ResumeRepo;
import com.chandu.ResumeAnalyzer.Repo.UserRepo;
import com.chandu.ResumeAnalyzer.ResumeExtractor.ResumeTextExtractor;
import com.chandu.ResumeAnalyzer.ResumeExtractor.ResumeValidationService;
import com.chandu.ResumeAnalyzer.dto.ResumeHistoryResponse;
import com.chandu.ResumeAnalyzer.model.Resume;
import com.chandu.ResumeAnalyzer.model.ResumeAnalysis;
import com.chandu.ResumeAnalyzer.model.User;
import com.chandu.ResumeAnalyzer.service.ResumeService;

@Service
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepo rr;
    private final UserRepo ur;
    private final ResumeTextExtractor resumeTextExtractor;
    private final ResumeValidationService resumeValidationService;

    @Value("${resume.upload-dir:uploads/resumes}")
    private String uploadDirectory;

    public ResumeServiceImpl(
            ResumeRepo rr,
            UserRepo ur,
            ResumeTextExtractor resumeTextExtractor,
            ResumeValidationService resumeValidationService) {

        this.rr = rr;
        this.ur = ur;
        this.resumeTextExtractor = resumeTextExtractor;
        this.resumeValidationService = resumeValidationService;
    }

    @Override
    @Transactional
    public Resume uploadResume(MultipartFile file, Long userId)
            throws IOException {

        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Please select a PDF file.");
        }

        String originalFileName = file.getOriginalFilename();

        if (originalFileName == null
                || !originalFileName.toLowerCase().endsWith(".pdf")) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only PDF files are allowed.");
        }

        byte[] fileBytes = file.getBytes();

        if (fileBytes.length < 5
                || fileBytes[0] != '%'
                || fileBytes[1] != 'P'
                || fileBytes[2] != 'D'
                || fileBytes[3] != 'F'
                || fileBytes[4] != '-') {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "The uploaded file is not a valid PDF.");
        }

        User user = ur.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found."));

        Path uploadPath = Paths.get(uploadDirectory)
                .toAbsolutePath()
                .normalize();

        Files.createDirectories(uploadPath);

        String storedFileName = UUID.randomUUID() + ".pdf";
        Path destination = uploadPath.resolve(storedFileName).normalize();

        if (!destination.startsWith(uploadPath)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid file path.");
        }

        Files.write(destination, fileBytes);

        try {
            String extractedText =
                    resumeTextExtractor.extractText(destination.toString());

            if (!resumeValidationService.isResume(extractedText)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "This PDF does not appear to be a resume. "
                        + "Please upload a resume containing sections "
                        + "such as education, skills, projects, "
                        + "experience or contact details.");
            }

            Resume resume = new Resume();
            resume.setFileName(originalFileName);
            resume.setFilePath(destination.toString());
            resume.setUploadDate(LocalDateTime.now());
            resume.setUser(user);

            return rr.save(resume);

        } catch (IOException | RuntimeException exception) {

            try {
                Files.deleteIfExists(destination);
            } catch (IOException cleanupException) {
                exception.addSuppressed(cleanupException);
            }

            throw exception;
        }
    }

    @Override
    public List<Resume> getAllResumes() {
        return rr.findAll();
    }

    @Override
    public Resume getResumeById(Long id) {
        return rr.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Resume not found."));
    }

    @Override
    @Transactional
    public void delteResume(Long id) {
        Resume resume = getResumeById(id);
        rr.delete(resume);
    }

    @Override
    public Resume saveResume(Resume resume) {
        return rr.save(resume);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResumeHistoryResponse> getUserResumeHistory(Long userId) {

        if (userId == null || !ur.existsById(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found.");
        }

        return rr.findByUser_IdOrderByUploadDateDesc(userId)
                .stream()
                .map(resume -> {

                    ResumeAnalysis analysis = resume.getAnalysis();

                    boolean analysisAvailable = analysis != null;
                    Double score = null;

                    if (analysis != null) {
                        score = (double) analysis.getOverallScore();
                    }

                    return new ResumeHistoryResponse(
                            resume.getId(),
                            resume.getFileName(),
                            resume.getUploadDate(),
                            analysisAvailable,
                            score);
                })
                .toList();
    }
}
