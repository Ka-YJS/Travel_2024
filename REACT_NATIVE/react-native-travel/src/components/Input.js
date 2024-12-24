import React, { useState, forwardRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

//스타일 컴포넌트 만들기
const Container = styled.View`
  flex-direction: column;
  width: 100%;
  margin: 5px 0;
`;
//textinput안에 쓰이는 글씨
const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: ${({ theme, isFocused }) => (isFocused ? theme.text : theme.label)};
  margin-left: 5px;
  font-family: GCB_Bold;
`;
//textinput 컴포넌트 
const StyledTextInput = styled.TextInput.attrs(({ theme }) => ({
    placeholderTextColor: theme.inputPlaceholder,
}))`
    background-color: ${({ theme, editable }) =>
        editable ? theme.background : theme.inputDisabledBackground};
    color: ${({ theme }) => theme.text};
    padding : 10px 10px;
    font-size: 16px;
    border : 1px solid ${({ theme, isFocused }) => (isFocused ? theme.text : theme.inputBorder)};
    border-radius : 4px;
    font-family: GCB_Bold;
    
`
//forwardRef
//react에서 특정 컴포넌트가 받은 ref를 자식 컴포넌트의 특정 DOM요소나
//react native 컴포넌트로 전달할 수 있도록 하는 기능
//forwardRef((props,ref))=>{}); 
const Input = forwardRef(
    (
        {
            label,
            value,
            onChangeText,
            onSubmitEditing,
            onBlur,
            placeholder,
            isPassword,
            returnKeyType,
            maxLength,
            disabled,
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        return (
            <Container>
                <Label isFocused={isFocused}>{label}</Label>
                <StyledTextInput
                    ref={ref} //login에서 정의된 useRef를 전달
                    isFocused={isFocused}//해당 input이 포커스가 된 상태냐
                    value={value}//호출한쪽에서 넘어온 값
                    onChangeText={onChangeText}//호출한쪽에서 넘어온 함수 
                    onSubmitEditing={onSubmitEditing}//호출한쪽에서 넘어온 함수
                    onFocus={() => setIsFocused(true)}//input 포커스가 잡힐때 실행
                    onBlur={() => { //input 포커스가 안될 때 실행
                        setIsFocused(false);
                        onBlur();//proptype에 디폴트가 설정한 값이 실행 
                    }}
                    placeholder={placeholder} //가이드라인
                    secureTextEntry={isPassword} //전달된 패스워드가 true이면 암호화 false면 글씨 표시 
                    returnKeyType={returnKeyType}//키보드 완료버튼 (확인인지 넥스트인지)
                    maxLength={maxLength}//글씨 몇글자까지 
                    autoCapitalize="none"//첫글짜 대문자 안나오게
                    autoCorrect={false} //단어 추천기능 안뜨게
                    textContentType="none" // iOS에서만 사용 옵션, 옵션따라 뜨는 키보드 달라짐 
                    underlineColorAndroid="transparent" // 컴포넌트의 밑줄 색상 설정할 때 사용 (안드로이드)
                    editable={!disabled}//해당 컴포넌트를 수정할수 잇냐(true) 없냐(false)
                />
            </Container>
        );
    }
);
Input.defaultProps = {
    onBlur: () => { },
    onChangeText: () => { },
    onSubmitEditing: () => { },
};

Input.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChangeText: PropTypes.func,
    onSubmitEditing: PropTypes.func,
    onBlur: PropTypes.func,
    placeholder: PropTypes.string,
    isPassword: PropTypes.bool,
    returnKeyType: PropTypes.oneOf(['done', 'next']),
    maxLength: PropTypes.number,
    onSubmitEditing: PropTypes.func,
    editable: PropTypes.bool,
}

export default Input