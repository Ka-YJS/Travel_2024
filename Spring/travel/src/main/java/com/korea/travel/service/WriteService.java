package com.korea.travel.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
	public boolean writeCreate(Long userId,WriteDTO writeDTO) {
		
		Optional<UserEntity> user = userRepository.findById(userId);
		
		//유저 확인
		if(user.isPresent()) {
				
			WriteEntity write = WriteEntity.builder()
					.writeTitle(writeDTO.getWriteTitle())
					.writeContent(writeDTO.getWriteContent())
					.writeCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")))
					.userEntity(user.get())
					.build();
			writeRepository.save(write);			
			return true;
			
		}else {
			return false;
		}
	}
	
	
	//게시글 수정
	public WriteDTO writeEdit(Long userId,Long writeId,WriteDTO writeDTO) {
		
		Optional<UserEntity> user = userRepository.findById(userId);
		
		Optional<WriteEntity> write = writeRepository.findById(writeId);
		
		//유저 확인
		if(user.isPresent()) {
			
			//유저가 작성한게시판이있는지 확인
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
		}else {
			return null;
		}
	}
	
	
}
