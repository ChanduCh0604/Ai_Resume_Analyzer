package com.chandu.ResumeAnalyzer.Repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.chandu.ResumeAnalyzer.model.User;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
	 Optional<User> findByEmail(String email);

}
