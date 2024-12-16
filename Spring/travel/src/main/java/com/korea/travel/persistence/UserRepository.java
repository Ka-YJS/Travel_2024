package com.korea.travel.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.korea.travel.model.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
		
		UserEntity findByUserId(String userId);
		
		UserEntity findByUserName(String userName);
		
		Boolean existsByUserId(String userId);
		
}
