
package com.chandu.ResumeAnalyzer.Repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chandu.ResumeAnalyzer.model.ResumeAnalysis;

@Repository
public interface ResumeAnalyzerRepo
        extends JpaRepository<ResumeAnalysis, Long> {

    Optional<ResumeAnalysis> findByResume_Id(Long resumeId);
}
