package com.technoforce.hunterspd.restfullWebService.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.technoforce.hunterspd.restfullWebService.Repo.UserRepo;
import com.technoforce.hunterspd.restfullWebService.model.User;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(String email) {
        return userRepository.findById(email).orElse(null);
    }

    public String registerUser(User user) {
        if (userRepository.existsById(user.getEmail())) {
            return "User already exists";
        }

        userRepository.save(user);
        return "Registration Successful";
    }		
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUserByEmail(String email) {
        userRepository.deleteById(email);
    }

	public Boolean existsByEmail(String email) {
		    return userRepository.existsByEmail(email);
	}
    
}
