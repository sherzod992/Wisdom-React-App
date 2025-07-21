export const serverApi: string = "http://localhost:3011";

export const Messages = {
    error1: "Something went wrong!",
    error2: "Please login first!",
    error3: "Please fullfill all inputs",
    error4: "Message is empty!",
    error5: "Only images with jpeg, jpg, png format allowed",
    
    // 한국어 로그인 에러 메시지들
    loginError_invalidCredentials: "아이디 또는 비밀번호가 잘못되었습니다.",
    loginError_accountNotFound: "존재하지 않는 계정입니다.",
    loginError_serverError: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    loginError_networkError: "네트워크 연결을 확인해주세요.",
    loginError_default: "로그인에 실패했습니다. 다시 시도해주세요.",
    
    // 회원가입 에러 메시지들
    signupError_duplicateUser: "이미 존재하는 아이디입니다.",
    signupError_invalidInput: "입력 정보를 확인해주세요.",
    signupError_default: "회원가입에 실패했습니다. 다시 시도해주세요.",
}