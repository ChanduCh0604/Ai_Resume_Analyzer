package com.chandu.ResumeAnalyzer.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chandu.ResumeAnalyzer.Repo.ResumeAnalyzerRepo;
import com.chandu.ResumeAnalyzer.Responses.ResumeAnalysisResponse;
import com.chandu.ResumeAnalyzer.model.ResumeAnalysis;
import com.chandu.ResumeAnalyzer.service.ResumeAnalysisService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/resumeAnalysis")
@CrossOrigin(origins = "http://localhost:5173")
public class ResumeAnalysisController {

    private final ResumeAnalysisService rass;
    private final ResumeAnalyzerRepo rar;

    public ResumeAnalysisController(
            ResumeAnalysisService rass,
            ResumeAnalyzerRepo rar) {
        this.rass = rass;
        this.rar = rar;
    }

    // Analyze a resume and save the result
    @PostMapping("/analyze/{resumeId}")
    public ResponseEntity<ResumeAnalysisResponse> analyzeResume(
            @PathVariable Long resumeId) {

        ResumeAnalysis result = rass.analyzeResume(resumeId);

        return ResponseEntity.ok(
                ResumeAnalysisResponse.from(result));
    }

    // Get analysis for one resume
    @GetMapping("/resume/{resumeId}")
    public ResponseEntity<ResumeAnalysisResponse> getAnalysisByResumeId(
            @PathVariable Long resumeId) {

        return rar.findByResume_Id(resumeId)
                .map(ResumeAnalysisResponse::from)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get all analysis records
    @GetMapping("/getAllresumesAnalysis")
    public ResponseEntity<List<ResumeAnalysisResponse>> getAll() {

        List<ResumeAnalysisResponse> responses = rar.findAll()
                .stream()
                .map(ResumeAnalysisResponse::from)
                .toList();

        return ResponseEntity.ok(responses);
    }

    // Save an analysis record
    @PostMapping("/saveResumes")
    public ResponseEntity<ResumeAnalysisResponse> saveAnalysis(
            @Valid @RequestBody ResumeAnalysis analysis) {

        ResumeAnalysis saved = rass.saveAnalysis(analysis);

        return ResponseEntity.ok(
                ResumeAnalysisResponse.from(saved));
    }

    // Delete an analysis record by its ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnalysis(
            @PathVariable Long id) {

        rass.deleteAnalysis(id);

        return ResponseEntity.noContent().build();
    }
}
