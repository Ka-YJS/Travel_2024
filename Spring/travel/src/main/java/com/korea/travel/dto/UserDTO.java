package com.korea.travel.dto;

import com.korea.travel.model.UserEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

	private Long id;			//고유 id
	private String userId;		//유저Id
	private String userName; 	//유저이름
	private String userNickName;	//닉네임
	private String userPassword;	//비밀번호
	
	//Entity -> DTO
//	public UserDTO (UserEntity entity) {
//		this.id = entity.getId();
//		this.userId = entity.getUserId();
//		this.userName = entity.getUserName();
//		this.userNickName = entity.getUserNickName();
//		this.userPassword = entity.getUserPassword();
//	}
//	
//	public static UserEntity toEntity (UserDTO dto) {
//		return UserEntity.builder()
//					.userId(dto.getUserId())
//					.userName(dto.getUserName())
//					.userNickName(dto.getUserNickName())
//					.userPassword(dto.getUserPassword())
//					.build();
//	}
	
}
