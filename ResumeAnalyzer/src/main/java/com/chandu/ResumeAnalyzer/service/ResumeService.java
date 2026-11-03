
package com.chandu.ResumeAnalyzer.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.chandu.ResumeAnalyzer.dto.ResumeHistoryResponse;
import com.chandu.ResumeAnalyzer.model.Resume;

public interface ResumeService {

    Resume uploadResume(MultipartFile file, Long userId) throws IOException;

    List<Resume> getAllResumes();

    Resume getResumeById(Long id);

    void delteResume(Long id);

    Resume saveResume(Resume resume);

    List<ResumeHistoryResponse> getUserResumeHistory(Long userId);
}
