package com.chandu.ResumeAnalyzer.ServiceImplementation;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.chandu.ResumeAnalyzer.AiServices.OllamaService;
import com.chandu.ResumeAnalyzer.Repo.ResumeAnalyzerRepo;
import com.chandu.ResumeAnalyzer.Repo.ResumeRepo;
import com.chandu.ResumeAnalyzer.ResumeExtractor.ResumeTextExtractor;
import com.chandu.ResumeAnalyzer.model.Resume;
import com.chandu.ResumeAnalyzer.model.ResumeAnalysis;
import com.chandu.ResumeAnalyzer.service.ResumeAnalysisService;

import tools.jackson.databind.JsonNode;

// Standard Spring Boot Jackson imports (Replaced tools.jackson)
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ResumeAnalysisImpl implements ResumeAnalysisService {

    private final ResumeAnalyzerRepo rar;
    private final ResumeRepo resumeRepo;
    private final ResumeTextExtractor textExtractor;
    private final OllamaService ollamaService;
    private final tools.jackson.databind.ObjectMapper objectMapper;

    public ResumeAnalysisImpl(
            ResumeAnalyzerRepo rar,
            ResumeRepo resumeRepo,
            ResumeTextExtractor textExtractor,
            OllamaService ollamaService,
            tools.jackson.databind.ObjectMapper objectMapper) {

        this.rar = rar;
        this.resumeRepo = resumeRepo;
        this.textExtractor = textExtractor;
        this.ollamaService = ollamaService;
        this.objectMapper = objectMapper;
    }

    @Override
    public ResumeAnalysis saveAnalysis(ResumeAnalysis Ra) {
        return rar.save(Ra);
    }

    @Override
    public List<ResumeAnalysis> getAllResumeAnalysis() {
        return rar.findAll();
    }

    @Override
    public void deleteAnalysis(Long id) {
        rar.deleteById(id);
    }

    @Override
    public ResumeAnalysis analyzeResume(Long resumeId) {

        Resume resume = resumeRepo.findById(resumeId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Resume not found with ID: " + resumeId));

        String resumeText;
        try {
            resumeText = textExtractor.extractText(resume.getFilePath());
        } catch (IOException e) {
            throw new RuntimeException("Unable to read the uploaded PDF.", e);
        }

        if (resumeText == null || resumeText.isBlank()) {
            throw new IllegalArgumentException("No readable text found in the PDF.");
        }

        String prompt = """
                You are an AI resume evaluation assistant.

                Analyze the supplied resume and return ONLY one valid JSON object.
                Do not include Markdown or explanations outside the JSON.

                Give scores from 0 to 100. Evaluate only information present
                in the resume. Do not invent skills or experience.

                Required JSON structure:
                {
                  "overallScore": 0,
                  "atsScore": 0,
                  "skillsScore": 0,
                  "experienceScore": 0,
                  "projectScore": 0,
                  "educationScore": 0,
                  "formatScore": 0,
                  "strengths": "Resume strengths",
                  "weaknesses": "Resume weaknesses",
                  "suggestions": "Specific improvement suggestions"
                }

                RESUME TEXT:
                """ + resumeText;

        String aiResponse = ollamaService.generateResponse(prompt);

        try {
        	int firstBrace = aiResponse.indexOf('{');
        	int lastBrace = aiResponse.lastIndexOf('}');

        	if (firstBrace < 0 || lastBrace <= firstBrace) {
        	    throw new IllegalArgumentException(
        	            "AI did not return valid JSON: " + aiResponse);
        	}

        	String json = aiResponse.substring(firstBrace, lastBrace + 1);
        	JsonNode  result = objectMapper.readTree(aiResponse);
            // Fetch existing or create a clean placeholder object
            ResumeAnalysis analysis = rar.findByResume_Id(resumeId)
                    .orElseGet(ResumeAnalysis::new);

            analysis.setResume(resume);
            analysis.setAnalysisDate(LocalDateTime.now());

            // Set scores mapped using the standardized JsonNode signature
            analysis.setOverallScore(getScore(result, "overallScore"));
            analysis.setAtsScore(getScore(result, "atsScore"));
            analysis.setSkillsScore(getScore(result, "skillsScore"));
            analysis.setExperienceScore(getScore(result, "experienceScore"));
            analysis.setProjectScore(getScore(result, "projectScore"));
            analysis.setEducationScore(getScore(result, "educationScore"));
            analysis.setFormatScore(getScore(result, "formatScore"));

            // Set text strings
            analysis.setStrengths(getText(result, "strengths"));
            analysis.setWeaknesses(getText(result, "weaknesses"));
            analysis.setSuggestions(getText(result, "suggestions"));

            return rar.save(analysis);

        } catch (Exception e) {
            throw new RuntimeException("Unable to process or save AI analysis: " + e.getMessage(), e);
        }
    }

    private int getScore(tools.jackson.databind.JsonNode result, String field) {
    	tools.jackson.databind.JsonNode value = result.get(field);

        if (value == null || !value.isNumber()) {
            throw new IllegalArgumentException("Missing or invalid score field: " + field);
        }

        int score = value.asInt();
        if (score < 0 || score > 100) {
            throw new IllegalArgumentException("Score must be between 0 and 100: " + field);
        }

        return score;
    }
    
    

    private String getText(tools.jackson.databind.JsonNode result, String field) {
    	tools.jackson.databind.JsonNode value = result.get(field);

        if (value == null || !value.isTextual()) {
            throw new IllegalArgumentException("Missing or invalid text field: " + field);
        }

        return value.asText();
    }
}
