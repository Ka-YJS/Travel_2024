import axios from "axios";

export async function call(api,method,request){

    let headers = new Headers({
        "Content-Type":"application/json"
    })
    //로컬 스토리지에서 ACCESS TOKEN 가져오기
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    if(accessToken && accessToken !== null){
        headers.append("Authorization","Bearer "+accessToken);
    }

    //기본 옵션 설정
    let options = {
        headers:headers,
        url : "http://localhost:9090" + api,
        method : method
    }

    //request가 존재하는 경우 : POST,PUT,DELETE와 같은 GET 이외의 요청일 때
    //요청 본문에 데이터를 담아 보낸다.
    if(request){
        //객체 형태로 전달된 데이터를 JSON문자열로 변환하여 서버에 전송한다.
        options.data = JSON.stringify(request);
    }

    //axios(option) : 앞서 설정한 option 객체를 사용하여 axios로 Http요청을 보낸다.
    return await axios(options)//포스트맨에 GET localhost:9090
    //요청이 성공적으로 처리된 경우 실행되는 코드
    .then(response => {
            return response.data;
    })
    //요청 중에 오류가 발생한 경우 실행되는 코드
    .catch(error => {
        //에러가 발생하면, 이를 console.log로 출력하여 디버깅하거나 문제를 파악할 수 있도록 한다.
        //상태코드가 403일때 login으로 리다이렉트
        if(error.status === 403){
            window.location.href="/";
        }
    })
}//call

export function login (userDTO) {
    return call("/travel/login", "POST", userDTO)
        .then(response => {
            console.log(response)
            if(response.token){
                //로컬 스토리지에 토큰 저장
                localStorage.setItem("ACCESS_TOKEN",response.token);
                //token이 존재할 경우 Todo화면으로 리다이렉트
                window.location.href="/main";
            } else {
                window.location.href="/travel/login";
            }
        })
}