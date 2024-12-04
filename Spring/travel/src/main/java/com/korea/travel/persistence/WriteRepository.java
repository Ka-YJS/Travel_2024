package com.korea.travel.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.korea.travel.model.UserEntity;
import com.korea.travel.model.WriteEntity;

@Repository
public interface WriteRepository extends JpaRepository<WriteEntity, Long> {
	
	List<WriteEntity> findByUser(UserEntity user);
}
