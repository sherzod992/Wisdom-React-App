/** SweetAlertHandling **/
import Swal from "sweetalert2";
import { Messages } from "./types/config.ts";


export const sweetErrorHandling = async (err: any) => {
  const error = err.response?.data ?? err;
  const message = error?.message ?? Messages.error1;
  await Swal.fire({
    icon: "error",
    text: message,
    didOpen: () => {
      const swal = Swal.getPopup();
      if (swal) swal.style.zIndex = "25001";
    },
    showConfirmButton: true,
  });
};

// 로그인 전용 에러 처리 함수
export const sweetLoginErrorHandling = async (err: any) => {
  let message = "로그인에 실패했습니다. 다시 시도해주세요.";
  let title = "로그인 실패";
  
  // 에러 타입에 따른 메시지 설정
  if (err.name) {
    switch (err.name) {
      case 'LOGIN_INVALID_CREDENTIALS':
      case 'LOGIN_UNAUTHORIZED':
        message = "아이디 또는 비밀번호가 잘못되었습니다.";
        title = "인증 실패";
        break;
      case 'LOGIN_ACCOUNT_NOT_FOUND':
        message = "존재하지 않는 계정입니다.";
        title = "계정 없음";
        break;
      case 'LOGIN_NETWORK_ERROR':
        message = "네트워크 연결을 확인해주세요.";
        title = "연결 오류";
        break;
      case 'LOGIN_SERVER_ERROR':
        message = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        title = "서버 오류";
        break;
      default:
        message = err.message || "로그인에 실패했습니다. 다시 시도해주세요.";
        break;
    }
  } else if (err.message) {
    message = err.message;
  }
  
  await Swal.fire({
    icon: "error",
    title: title,
    text: message,
    confirmButtonText: "확인",
    confirmButtonColor: "#d33",
    didOpen: () => {
      const swal = Swal.getPopup();
      if (swal) swal.style.zIndex = "25001";
    },
    showConfirmButton: true,
  });
};

// 회원가입 전용 에러 처리 함수
export const sweetSignupErrorHandling = async (err: any) => {
  let message = "회원가입에 실패했습니다. 다시 시도해주세요.";
  let title = "회원가입 실패";
  
  // 에러 타입에 따른 메시지 설정
  if (err.name) {
    switch (err.name) {
      case 'SIGNUP_DUPLICATE_USER':
      case 'SIGNUP_CONFLICT':
        message = "이미 존재하는 아이디입니다. 다른 아이디를 선택해주세요.";
        title = "중복 계정";
        break;
      case 'SIGNUP_INVALID_INPUT':
        message = "입력 정보를 확인해주세요. 모든 필드를 올바르게 입력해주세요.";
        title = "입력 오류";
        break;
      case 'SIGNUP_NETWORK_ERROR':
        message = "네트워크 연결을 확인해주세요.";
        title = "연결 오류";
        break;
      case 'SIGNUP_SERVER_ERROR':
        message = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        title = "서버 오류";
        break;
      default:
        message = err.message || "회원가입에 실패했습니다. 다시 시도해주세요.";
        break;
    }
  } else if (err.message) {
    message = err.message;
  }
  
  await Swal.fire({
    icon: "error",
    title: title,
    text: message,
    confirmButtonText: "확인",
    confirmButtonColor: "#d33",
    didOpen: () => {
      const swal = Swal.getPopup();
      if (swal) swal.style.zIndex = "25001";
    },
    showConfirmButton: true,
  });
};

export const sweetTopSuccessAlert = async (
  msg: string,
  duration: number = 2000
) => {
  await Swal.fire({
    position: "top-end",
    icon: "success",
    title: msg,
    showConfirmButton: false,
    timer: duration,
  });
};

export const sweetTopSmallSuccessAlert = async (
  msg: string,
  duration: number = 2000
) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: true,
  });

  Toast.fire({
    icon: "success",
    title: msg,
  }).then();
};

export const sweetFailureProvider = (
  msg: string,
  show_button: boolean = false,
  forward_url: string = ""
) => {
  Swal.fire({
    icon: "error",
    title: msg,
    showConfirmButton: show_button,
    confirmButtonText: "OK",
  }).then(() => {
    if (forward_url !== "") {
      window.location.replace(forward_url);
    }
  });
};
