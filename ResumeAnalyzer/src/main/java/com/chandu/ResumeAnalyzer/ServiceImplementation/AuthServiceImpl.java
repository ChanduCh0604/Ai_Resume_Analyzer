package com.chandu.ResumeAnalyzer.ServiceImplementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.chandu.ResumeAnalyzer.Repo.UserRepo;
import com.chandu.ResumeAnalyzer.dto.LoginRequest;
import com.chandu.ResumeAnalyzer.dto.RegisterRequest;
import com.chandu.ResumeAnalyzer.model.User;
import com.chandu.ResumeAnalyzer.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User register(RegisterRequest request) {

    	if (userRepo.findByEmail(request.getEmail()).isPresent()) {
    	    throw new RuntimeException("Email is already registered");
    	}
    	
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepo.save(user);
    }

    @Override
    public User login(LoginRequest request) {

        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }
}