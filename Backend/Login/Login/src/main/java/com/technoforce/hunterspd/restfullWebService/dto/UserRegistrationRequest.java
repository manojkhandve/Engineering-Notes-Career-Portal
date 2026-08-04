package com.technoforce.hunterspd.restfullWebService.dto;

import java.time.Year;

public class UserRegistrationRequest {

    private String email;
    private String name;
    private String password;
    private String college;
    private String branch;
    private Year passOutYear;
    private String otp;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public Year getPassOutYear() {
        return passOutYear;
    }

    public void setPassOutYear(Year passOutYear) {
        this.passOutYear = passOutYear;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}