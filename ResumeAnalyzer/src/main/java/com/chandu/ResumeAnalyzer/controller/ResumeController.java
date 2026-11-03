
package com.chandu.ResumeAnalyzer.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.chandu.ResumeAnalyzer.dto.ResumeHistoryResponse;
import com.chandu.ResumeAnalyzer.model.Resume;
import com.chandu.ResumeAnalyzer.service.ResumeService;

@RestController
@RequestMapping("/resumes")
@CrossOrigin(origins = "http://localhost:5173")
public class ResumeController {

    @Autowired
    ResumeService rs;

    @PostMapping("/upload")
    public Resume uploadResume(
            @RequestParam("resume") MultipartFile file,
            @RequestParam("user_id") Long userId) throws IOException {

        return rs.uploadResume(file, userId);
    }

    @GetMapping
    public List<Resume> getAllResumes() {
        return rs.getAllResumes();
    }

    @GetMapping("/{id}")
    public Resume getResumeById(@PathVariable Long id) {
        return rs.getResumeById(id);
    }

    // Get all resumes belonging to a specific user
    @GetMapping("/user/{userId}/history")
    public List<ResumeHistoryResponse> getUserResumeHistory(
            @PathVariable Long userId) {

        return rs.getUserResumeHistory(userId);
    }

    // Display the uploaded PDF in the browser
    @GetMapping("/{id}/pdf")
    public ResponseEntity<Resource> viewResumePdf(
            @PathVariable Long id) throws IOException {

        Resume resume = rs.getResumeById(id);

        if (resume == null
                || resume.getFilePath() == null
                || resume.getFilePath().isBlank()) {

            return ResponseEntity.notFound().build();
        }

        Path pdfPath = Paths.get(resume.getFilePath())
                .toAbsolutePath()
                .normalize();

        if (!Files.exists(pdfPath)
                || !Files.isRegularFile(pdfPath)) {

            return ResponseEntity.notFound().build();
        }

        if (resume.getFileName() == null
                || !resume.getFileName()
                        .toLowerCase()
                        .endsWith(".pdf")) {

            return ResponseEntity
                    .status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                    .build();
        }

        Resource pdfResource = new FileSystemResource(pdfPath);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.inline()
                                .filename(resume.getFileName())
                                .build()
                                .toString())
                .body(pdfResource);
    }

    @DeleteMapping("/{id}")
    public String deleteResume(@PathVariable Long id) {
        rs.delteResume(id);
        return "Resume deleted successfully";
    }
}
