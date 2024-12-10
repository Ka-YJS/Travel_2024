import axios from "axios";

export async function call(api,method,request,user){

    let headers = {"Content-Type": "application/json"};

    //사용자 토큰이 있다면 Authorization 헤더에 추가
    if(user.token && user.token !== null){
        headers["Authorization"] = `Bearer ${user.token}`;
    }

    try {
        // 동적으로 메서드를 호출
        const response = await axios({
            method: method,
            url: `http://localhost:9090${api}`,
            data: request,
            headers: headers
        });
        
        if (response) {
            console.log(response.data);
            return response.data;
        }
        
    } catch (error) {
        console.error('API 호출 중 오류 발생', error);
        window.location.href="/main";
        return false;
    }
    

}//call