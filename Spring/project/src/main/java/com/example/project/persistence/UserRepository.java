package com.example.project.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.project.model.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
		
		UserEntity findByUserId(String userId);
		
		UserEntity findByUserName(String userName);
		
		Boolean existsByUserId(String userId);
		
}
