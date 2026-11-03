package com.chandu.ResumeAnalyzer.ServiceImplementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chandu.ResumeAnalyzer.Repo.UserRepo;
import com.chandu.ResumeAnalyzer.model.User;
import com.chandu.ResumeAnalyzer.service.UserService;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	UserRepo ur;

	@Override
	public List<User> createUser(List<User> ue) {
		// TODO Auto-generated method stub
		return ur.saveAll(ue);
	}

	@Override
	public List<User> getAllUser() {
		// TODO Auto-generated method stub
		return ur.findAll();
	}

	@Override
	public User getUserById(Long id) {
		// TODO Auto-generated method stub
		return ur.findById(id).orElseThrow();
	}

	@Override
	public void deleteUser(Long id) {
		// TODO Auto-generated method stub
		ur.deleteById(id);
	}

	@Override
	public User UpdateUser1(User u, Long id) {
		// TODO Auto-generated method stub
		User ue = getUserById(id);
		ue.setName(u.getName());
		ue.setEmail(u.getEmail());
		ue.setPhone(u.getPhone());
		ue.setPassword(u.getPassword());
		return ur.save(ue);
	}
	

}
