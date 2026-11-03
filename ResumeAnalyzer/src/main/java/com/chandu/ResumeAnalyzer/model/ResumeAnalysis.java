package com.chandu.ResumeAnalyzer.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "resume_analysis")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeAnalysis {

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public double getOverallScore() {
		return overallScore;
	}

	public void setOverallScore(int overallScore) {
		this.overallScore = overallScore;
	}

	public int getAtsScore() {
		return atsScore;
	}

	public void setAtsScore(int atsScore) {
		this.atsScore = atsScore;
	}

	public int getSkillsScore() {
		return skillsScore;
	}

	public void setSkillsScore(int skillsScore) {
		this.skillsScore = skillsScore;
	}

	public int getExperienceScore() {
		return experienceScore;
	}

	public void setExperienceScore(int experienceScore) {
		this.experienceScore = experienceScore;
	}

	public int getProjectScore() {
		return projectScore;
	}

	public void setProjectScore(int projectScore) {
		this.projectScore = projectScore;
	}

	public int getEducationScore() {
		return educationScore;
	}

	public void setEducationScore(int educationScore) {
		this.educationScore = educationScore;
	}

	public int getFormatScore() {
		return formatScore;
	}

	public void setFormatScore(int formatScore) {
		this.formatScore = formatScore;
	}

	public String getStrengths() {
		return strengths;
	}

	public void setStrengths(String strengths) {
		this.strengths = strengths;
	}

	public String getWeaknesses() {
		return weaknesses;
	}

	public void setWeaknesses(String weaknesses) {
		this.weaknesses = weaknesses;
	}

	public String getSuggestions() {
		return suggestions;
	}

	public void setSuggestions(String suggestions) {
		this.suggestions = suggestions;
	}

	public LocalDateTime getAnalysisDate() {
		return analysisDate;
	}

	public void setAnalysisDate(LocalDateTime analysisDate) {
		this.analysisDate = analysisDate;
	}

	public Resume getResume() {
		return resume;
	}

	public void setResume(Resume resume) {
		this.resume = resume;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;

	double overallScore;

	int atsScore;

	int skillsScore;

	int experienceScore;

	int projectScore;

	int educationScore;

	int formatScore;

	@Column(length = 2000)
	String strengths;

	@Column(length = 2000)
	String weaknesses;

	@Column(length = 3000)
	String suggestions;

	LocalDateTime analysisDate;

	@OneToOne
	@JoinColumn(name = "resume_id")
	private Resume resume;
}
