package com.chandu.ResumeAnalyzer.service;

import org.springframework.stereotype.Service;

import com.chandu.ResumeAnalyzer.dto.LoginRequest;
import com.chandu.ResumeAnalyzer.dto.RegisterRequest;
import com.chandu.ResumeAnalyzer.model.User;
@Service
public interface AuthService {

    User register(RegisterRequest request);

    User login(LoginRequest request);
}