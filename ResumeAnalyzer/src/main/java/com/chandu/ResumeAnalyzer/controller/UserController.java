
package com.chandu.ResumeAnalyzer.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chandu.ResumeAnalyzer.model.User;
import com.chandu.ResumeAnalyzer.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    UserService ur;

    @PostMapping("/saveUsers")
    public List<User> saveAllUsers(@RequestBody List<User> u) {
        return ur.createUser(u);
    }

    @GetMapping("/getAllUsers")
    public List<User> getAllUsers() {
        return ur.getAllUser();
    }

    @GetMapping("/getone/{id}")
    public User getbyUser(@PathVariable Long id) {
        return ur.getUserById(id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUsers(@PathVariable Long id) {
        ur.deleteUser(id);
    }

    @PutMapping("/update/{id}")
    public User UpdatedUsers(@RequestBody User u, @PathVariable Long id) {
        return ur.UpdateUser1(u, id);
    }
}
