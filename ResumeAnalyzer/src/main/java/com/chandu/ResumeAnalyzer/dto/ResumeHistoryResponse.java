
package com.chandu.ResumeAnalyzer.dto;

import java.time.LocalDateTime;

public class ResumeHistoryResponse {

    private Long resumeId;
    private String fileName;
    private LocalDateTime uploadDate;
    private boolean analysisAvailable;
    private Double overallScore;

    public ResumeHistoryResponse(
            Long resumeId,
            String fileName,
            LocalDateTime uploadDate,
            boolean analysisAvailable,
            Double overallScore) {

        this.resumeId = resumeId;
        this.fileName = fileName;
        this.uploadDate = uploadDate;
        this.analysisAvailable = analysisAvailable;
        this.overallScore = overallScore;
    }

    public Long getResumeId() {
        return resumeId;
    }

    public String getFileName() {
        return fileName;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public boolean isAnalysisAvailable() {
        return analysisAvailable;
    }

    public Double getOverallScore() {
        return overallScore;
    }
}
