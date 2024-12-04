package com.korea.travel.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.korea.travel.dto.WriteDTO;
import com.korea.travel.model.UserEntity;
import com.korea.travel.model.WriteEntity;
import com.korea.travel.persistence.UserRepository;
import com.korea.travel.persistence.WriteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WriteService {
	
	private final WriteRepository writeRepository;
	private final UserRepository userRepository;
	
	//게시글 등록
	public boolean writeCreate(Long userid,WriteDTO writeDTO) {
		Optional<UserEntity> user = userRepository.findById(userid);
		
		if(user.isPresent()) {
			WriteEntity write = new WriteEntity();
			write.setWriteTitle(writeDTO.getWriteTitle());
			write.setWriteContent(writeDTO.getWriteContent());
			write.setUser(user.get());			
			writeRepository.save(write);
			
			return true;
		}else {
			return false;
		}
	}
	
	
	//게시글 수정
	public WriteDTO writeEdit(Long writeId,WriteDTO writeDTO) {
		Optional<WriteEntity> write = writeRepository.findById(writeId);
		
		if(write.isPresent()) {
			WriteEntity writeEntity = write.get();
			writeEntity.setWriteTitle(writeDTO.getWriteTitle());
			writeEntity.setWriteContent(writeDTO.getWriteContent());
			writeRepository.save(writeEntity);
			
			return WriteDTO.builder()
					.writeTitle(writeEntity.getWriteTitle())
					.writeContent(writeEntity.getWriteContent())
					.build();
		}else {
			return null;
		}
	}
	
	
}
