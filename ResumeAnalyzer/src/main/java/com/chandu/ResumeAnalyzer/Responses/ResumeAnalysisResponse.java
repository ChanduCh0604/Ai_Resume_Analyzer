
package com.chandu.ResumeAnalyzer.Responses;

import java.time.LocalDateTime;

import com.chandu.ResumeAnalyzer.model.ResumeAnalysis;

public class ResumeAnalysisResponse {

	private Long id;
	private Long resumeId;

	private int overallScore;
	private int atsScore;
	private int skillsScore;
	private int experienceScore;
	private int projectScore;
	private int educationScore;
	private int formatScore;

	private String strengths;
	private String weaknesses;
	private String suggestions;

	private LocalDateTime analysisDate;

	public ResumeAnalysisResponse() {
	}

	public ResumeAnalysisResponse(Long id, Long resumeId, int overallScore, int atsScore, int skillsScore,
			int experienceScore, int projectScore, int educationScore, int formatScore, String strengths,
			String weaknesses, String suggestions, LocalDateTime analysisDate) {

		this.id = id;
		this.resumeId = resumeId;
		this.overallScore = overallScore;
		this.atsScore = atsScore;
		this.skillsScore = skillsScore;
		this.experienceScore = experienceScore;
		this.projectScore = projectScore;
		this.educationScore = educationScore;
		this.formatScore = formatScore;
		this.strengths = strengths;
		this.weaknesses = weaknesses;
		this.suggestions = suggestions;
		this.analysisDate = analysisDate;
	}

	public static ResumeAnalysisResponse from(ResumeAnalysis analysis) {

		Long resumeId = null;

		if (analysis.getResume() != null) {
			resumeId = analysis.getResume().getId();
		}

		ResumeAnalysisResponse response = new ResumeAnalysisResponse();

		response.id = analysis.getId();
		response.resumeId = resumeId;
		response.overallScore = (int) analysis.getOverallScore();
		response.atsScore = analysis.getAtsScore();
		response.skillsScore = analysis.getSkillsScore();
		response.experienceScore = analysis.getExperienceScore();
		response.projectScore = analysis.getProjectScore();
		response.educationScore = analysis.getEducationScore();
		response.formatScore = analysis.getFormatScore();
		response.strengths = analysis.getStrengths();
		response.weaknesses = analysis.getWeaknesses();
		response.suggestions = analysis.getSuggestions();
		response.analysisDate = analysis.getAnalysisDate();

		return response;
	}

	public Long getId() {
		return id;
	}

	public Long getResumeId() {
		return resumeId;
	}

	public int getOverallScore() {
		return overallScore;
	}

	public int getAtsScore() {
		return atsScore;
	}

	public int getSkillsScore() {
		return skillsScore;
	}

	public int getExperienceScore() {
		return experienceScore;
	}

	public int getProjectScore() {
		return projectScore;
	}

	public int getEducationScore() {
		return educationScore;
	}

	public int getFormatScore() {
		return formatScore;
	}

	public String getStrengths() {
		return strengths;
	}

	public String getWeaknesses() {
		return weaknesses;
	}

	public String getSuggestions() {
		return suggestions;
	}

	public LocalDateTime getAnalysisDate() {
		return analysisDate;
	}
}