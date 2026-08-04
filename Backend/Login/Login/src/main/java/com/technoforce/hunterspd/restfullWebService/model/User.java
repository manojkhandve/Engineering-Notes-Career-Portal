package com.technoforce.hunterspd.restfullWebService.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="users")
public class User {
	@Id
	private String email;
	
	private String name;
	private String password;
	private String college;
	private String branch;
	private Integer passOutYear;
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
	public Integer getPassOutYear() {
		return passOutYear;
	}
	public void setPassOutYear(Integer passOutYear) {
		this.passOutYear = passOutYear;
	}
	@Override
	public String toString() {
		return "User [email=" + email + ", name=" + name + ", password=" + password + ", college=" + college
				+ ", branch=" + branch + ", passOutYear=" + passOutYear + "]";
	}
	public User(String email, String name, String password, String college, String branch, Integer passOutYear) {
		super();
		this.email = email;
		this.name = name;
		this.password = password;
		this.college = college;
		this.branch = branch;
		this.passOutYear = passOutYear;
	}
	public User() {
		super();
	}
	
	
}
