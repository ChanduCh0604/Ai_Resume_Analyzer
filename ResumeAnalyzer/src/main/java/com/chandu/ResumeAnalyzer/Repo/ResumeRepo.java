
package com.chandu.ResumeAnalyzer.Repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.chandu.ResumeAnalyzer.model.Resume;

public interface ResumeRepo extends JpaRepository<Resume, Long> {

    List<Resume> findByUser_IdOrderByUploadDateDesc(Long userId);
}
