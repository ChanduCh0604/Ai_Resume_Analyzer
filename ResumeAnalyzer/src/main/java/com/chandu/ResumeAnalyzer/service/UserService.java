package com.chandu.ResumeAnalyzer.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.chandu.ResumeAnalyzer.model.User;

@Service
public interface UserService {
	
	List<User> createUser(List<User> ue);
	List<User> getAllUser();
	User getUserById(Long id);
	void deleteUser(Long id);
	User UpdateUser1(User u, Long id);
}
