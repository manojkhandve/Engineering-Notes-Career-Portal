package com.technoforce.hunterspd.restfullWebService.Repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.technoforce.hunterspd.restfullWebService.model.User;
@Repository
public interface UserRepo extends JpaRepository<User, String> {

	boolean existsByEmail(String email);

}
