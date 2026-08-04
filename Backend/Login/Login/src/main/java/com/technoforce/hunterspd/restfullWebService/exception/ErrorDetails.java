package com.technoforce.hunterspd.restfullWebService.exception;

import java.time.LocalDateTime;

public class ErrorDetails {
	private LocalDateTime dateTime;
	private String msg;
	private String details;
	public ErrorDetails(LocalDateTime dateTime, String msg, String details) {
		super();
		this.dateTime = dateTime;
		this.msg = msg;
		this.details = details;
	}
	public LocalDateTime getDateTime() {
		return dateTime;
	}
	public String getMsg() {
		return msg;
	}
	public String getDetails() {
		return details;
	}
	
	
}
