package com.technoforce.hunterspd.restfullWebService.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.technoforce.hunterspd.restfullWebService.model.User;
import com.technoforce.hunterspd.restfullWebService.service.OtpService;
import com.technoforce.hunterspd.restfullWebService.service.UserService;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
@FeignClient(name = "Login")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private OtpService otpService;

    // SEND OTP
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {

        otpService.sendOtp(email);

        return ResponseEntity.ok("OTP Sent Successfully");
    }
    
    @GetMapping("/users/email/{email}")
    public Boolean existsByEmail(@PathVariable String email) {
        return userService.existsByEmail(email);
    }

    // VERIFY OTP + REGISTER
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(
            @RequestBody User user,
            @RequestParam String otp) {

        boolean valid = otpService.verifyOtp(user.getEmail(), otp);

        if (!valid) {
            return new ResponseEntity<>("Invalid OTP", HttpStatus.BAD_REQUEST);
        }

        String result = userService.registerUser(user);

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    // GET ALL
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // GET ONE
    @GetMapping("/users/{email}")
    public ResponseEntity<User> getUser(@PathVariable String email) {
        return ResponseEntity.ok(userService.getUserById(email));
    }
    
 // UPDATE USER
    @PutMapping("/users/{email}")
    public ResponseEntity<String> updateUser(
            @PathVariable String email,
            @RequestBody User user) {

        User existingUser = userService.getUserById(email);

        if (existingUser == null) {
            return new ResponseEntity<>("User Not Found", HttpStatus.NOT_FOUND);
        }

        existingUser.setName(user.getName());
        existingUser.setPassword(user.getPassword());
        existingUser.setCollege(user.getCollege());
        existingUser.setBranch(user.getBranch());
        existingUser.setPassOutYear(user.getPassOutYear());

        userService.updateUser(existingUser);

        return ResponseEntity.ok("Profile Updated Successfully");
    }

    // DELETE
    @DeleteMapping("/users/{email}")
    public ResponseEntity<String> deleteUser(@PathVariable String email) {
        userService.deleteUserByEmail(email);
        return ResponseEntity.ok("Deleted Successfully");
    }
}