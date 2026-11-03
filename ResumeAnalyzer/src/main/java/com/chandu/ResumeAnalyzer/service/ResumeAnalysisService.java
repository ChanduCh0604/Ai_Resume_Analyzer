
package com.chandu.ResumeAnalyzer.service;

import java.util.List;

import com.chandu.ResumeAnalyzer.model.ResumeAnalysis;

public interface ResumeAnalysisService {

    ResumeAnalysis saveAnalysis(ResumeAnalysis Ra);

    List<ResumeAnalysis> getAllResumeAnalysis();

    void deleteAnalysis(Long id);

    ResumeAnalysis analyzeResume(Long resumeId);
}
