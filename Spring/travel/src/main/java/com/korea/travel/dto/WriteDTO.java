package com.korea.travel.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WriteDTO {
	
	private Long id;				//고유 id
	private String writeTitle;		//게시글제목
	private String writeContent;	//게시글내용
	private String writeCreatedAt;	//게시글등록시간
	
}
