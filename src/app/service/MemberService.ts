import axios, { AxiosInstance } from "axios";
import { serverApi } from "../../lib/types/config.ts";
import { LoginInput, Member, MemberInput } from "../../lib/types/member.ts";

class MemberService {
  private readonly path: string;
  private readonly api: AxiosInstance;

  constructor() {
    this.path = serverApi;
    
    // axios 인스턴스 생성 및 기본 설정
    this.api = axios.create({
      baseURL: this.path,
      withCredentials: true,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // 요청 인터셉터
    this.api.interceptors.request.use(
      (config) => {
        console.log(`🚀 API 요청: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error("❌ 요청 오류:", error);
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터
    this.api.interceptors.response.use(
      (response) => {
        console.log(`✅ API 응답: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(`❌ API 오류: ${error.response?.status} ${error.config?.url}`, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  public async getTopUsers(): Promise<Member[]> {
    try {
      const url = `/member/top-users`;
      const result = await this.api.get(url);
      console.log("getTopUsers:", result.data);
      return result.data;
    } catch (err) {
      console.log("getTopUsers error:", err);
      throw err;
    }
  }

  public async getCurrentMember(): Promise<Member> {
    try {
      const url = `/member/detail`;
      const result = await this.api.get(url);
      console.log("getCurrentMember:", result.data);
      return result.data;
    } catch (err) {
      console.log("getCurrentMember error:", err);
      throw err;
    }
  }

  public async signup(input: MemberInput): Promise<Member> {
    try {
      const url = `/member/signup`;
      const result = await this.api.post(url, input);
      const member: Member = result.data.member;
      try {
        if (member && typeof member === 'object') {
          localStorage.setItem("memberData", JSON.stringify(member));
        }
      } catch (error) {
        console.error("Error saving signup member to localStorage:", error);
      }
      console.log("signup:", member);
      return member;
    } catch (err: any) {
      console.log("signup error:", err);
      
      // HTTP 상태 코드에 따른 구체적인 에러 메시지 설정
      if (err.response) {
        const status = err.response.status;
        const serverMessage = err.response.data?.message || '';
        
        switch (status) {
          case 400:
            // 잘못된 요청 (중복 사용자, 유효하지 않은 입력 등)
            if (serverMessage.includes('already exists') || 
                serverMessage.includes('duplicate') ||
                serverMessage.includes('이미 존재')) {
              const error = new Error("이미 존재하는 아이디입니다.");
              error.name = 'SIGNUP_DUPLICATE_USER';
              throw error;
            } else {
              const error = new Error("입력 정보를 확인해주세요.");
              error.name = 'SIGNUP_INVALID_INPUT';
              throw error;
            }
          case 409:
            // 중복 리소스
            const error409 = new Error("이미 존재하는 아이디입니다.");
            error409.name = 'SIGNUP_CONFLICT';
            throw error409;
          case 500:
          case 502:
          case 503:
            // 서버 오류
            const error5xx = new Error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            error5xx.name = 'SIGNUP_SERVER_ERROR';
            throw error5xx;
          default:
            const errorDefault = new Error("회원가입에 실패했습니다. 다시 시도해주세요.");
            errorDefault.name = 'SIGNUP_UNKNOWN_ERROR';
            throw errorDefault;
        }
      } else if (err.request) {
        // 네트워크 오류
        const networkError = new Error("네트워크 연결을 확인해주세요.");
        networkError.name = 'SIGNUP_NETWORK_ERROR';
        throw networkError;
      } else {
        // 기타 오류
        const otherError = new Error("회원가입에 실패했습니다. 다시 시도해주세요.");
        otherError.name = 'SIGNUP_OTHER_ERROR';
        throw otherError;
      }
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    try {
      const url = `/member/login`;
      const result = await this.api.post(url, input);
      const member: Member = result.data.member;
      
      try {
        if (member && typeof member === 'object') {
          localStorage.setItem("memberData", JSON.stringify(member));
        }
      } catch (error) {
        console.error("Error saving login member to localStorage:", error);
      }
      console.log("login:", member);
      return member;
    } catch (err: any) {
      console.log("login error:", err);
      
      // HTTP 상태 코드에 따른 구체적인 에러 메시지 설정
      if (err.response) {
        const status = err.response.status;
        const serverMessage = err.response.data?.message || '';
        
        switch (status) {
          case 400:
            if (serverMessage.includes('Please try again') || 
                serverMessage.includes('Invalid credentials') ||
                serverMessage.includes('Wrong password') ||
                serverMessage.includes('User not found')) {
              const error = new Error("아이디 또는 비밀번호가 잘못되었습니다.");
              error.name = 'LOGIN_INVALID_CREDENTIALS';
              throw error;
            } else {
              const error = new Error("입력 정보를 확인해주세요.");
              error.name = 'LOGIN_INVALID_INPUT';
              throw error;
            }
          case 401:
            const error401 = new Error("아이디 또는 비밀번호가 잘못되었습니다.");
            error401.name = 'LOGIN_UNAUTHORIZED';
            throw error401;
          case 404:
            const error404 = new Error("존재하지 않는 계정입니다.");
            error404.name = 'LOGIN_ACCOUNT_NOT_FOUND';
            throw error404;
          case 500:
          case 502:
          case 503:
            const error5xx = new Error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            error5xx.name = 'LOGIN_SERVER_ERROR';
            throw error5xx;
          default:
            const errorDefault = new Error("로그인에 실패했습니다. 다시 시도해주세요.");
            errorDefault.name = 'LOGIN_UNKNOWN_ERROR';
            throw errorDefault;
        }
      } else if (err.request) {
        const networkError = new Error("네트워크 연결을 확인해주세요.");
        networkError.name = 'LOGIN_NETWORK_ERROR';
        throw networkError;
      } else {
        const otherError = new Error("로그인에 실패했습니다. 다시 시도해주세요.");
        otherError.name = 'LOGIN_OTHER_ERROR';
        throw otherError;
      }
    }
  }

  public async logout(): Promise<void> {
    try {
      const url = `/member/logout`;
      console.log("로그아웃 요청 URL:", `${this.path}${url}`);
      
      // 타임아웃 설정 (5초)
      const result = await this.api.post(url, {}, { timeout: 5000 });
      
      localStorage.removeItem("memberData");
      console.log("로그아웃 응답:", result.data);
      console.log("memberData 로컬스토리지에서 제거됨");
    } catch (err: any) {
      console.error("로그아웃 서비스 오류:", err);
      
      // 서버 오류가 있어도 로컬 데이터는 정리
      localStorage.removeItem("memberData");
      
      // 네트워크 오류인 경우 더 구체적인 메시지
      if (err.code === 'ECONNABORTED') {
        throw new Error('서버 응답 시간이 초과되었습니다.');
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        throw new Error('서버에 연결할 수 없습니다.');
      } else {
        throw err;
      }
    }
  }

  public async updateMember(input: FormData | Partial<Member>): Promise<Member> {
    try {
      const url = `/member/update`;
      console.log("UpdateMember URL:", `${this.path}${url}`);
      console.log("UpdateMember input type:", input instanceof FormData ? "FormData" : "JSON");
      
      const config = {
        headers: {
          "Content-Type": input instanceof FormData ? "multipart/form-data" : "application/json",
        },
        timeout: 30000, // 30초 타임아웃
      };
      
      console.log("Sending update request...");
      const result = await this.api.post(url, input, config);
      console.log("Update response status:", result.status);
      console.log("Update response data:", result.data);
      console.log("Response data structure:", {
        hasData: !!result.data,
        hasMember: !!result.data?.member,
        dataKeys: result.data ? Object.keys(result.data) : [],
        fullResponse: result.data
      });
      
      // 서버 응답 구조에 따라 멤버 정보 추출
      let updatedMember: Member;
      
      if (result.data.member) {
        updatedMember = result.data.member;
        console.log("Found member in result.data.member");
      } else if (result.data.data) {
        updatedMember = result.data.data;
        console.log("Found member in result.data.data");
      } else if (result.data._id) {
        // 응답 자체가 멤버 객체인 경우
        updatedMember = result.data;
        console.log("Found member in result.data directly");
      } else if (result.data.success && result.data.result) {
        // success: true, result: member 구조
        updatedMember = result.data.result;
        console.log("Found member in result.data.result");
      } else {
        console.error("Unknown response structure:", result.data);
        console.log("Available keys:", Object.keys(result.data));
        
        // 서버가 업데이트는 성공했지만 응답 구조가 다른 경우
        // getCurrentMember를 호출하여 최신 정보 가져오기
        console.log("Trying to fetch updated member info via getCurrentMember...");
        try {
          updatedMember = await this.getCurrentMember();
          console.log("Successfully fetched updated member via getCurrentMember");
        } catch (getCurrentError) {
          console.error("Failed to get current member:", getCurrentError);
          
          // 마지막 대안: 현재 localStorage 데이터 사용
          const currentMemberData = localStorage.getItem("memberData");
          if (currentMemberData) {
            updatedMember = JSON.parse(currentMemberData);
            console.log("Using current member data as final fallback");
          } else {
            throw new Error("서버에서 업데이트된 멤버 정보를 받지 못했습니다.");
          }
        }
      }
      
      console.log("Extracted member:", updatedMember);
      
      // 기본적인 검증만 수행
      if (!updatedMember) {
        throw new Error("서버에서 유효하지 않은 멤버 정보를 받았습니다.");
      }
      
      // localStorage에도 업데이트된 멤버 정보 저장
      try {
        if (updatedMember && typeof updatedMember === 'object') {
          localStorage.setItem("memberData", JSON.stringify(updatedMember));
          console.log("Updated member saved to localStorage");
        }
      } catch (error) {
        console.error("Error saving updated member to localStorage:", error);
      }
      console.log("updateMember successful:", updatedMember);
      
      return updatedMember;
    } catch (err: any) {
      console.error("updateMember detailed error:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: err.config
      });
      
      // 401 오류의 경우 localStorage 정리
      if (err.response?.status === 401) {
        console.log("401 error detected, clearing localStorage");
        localStorage.removeItem("memberData");
      }
      
      throw err;
    }
  }
}

export default MemberService;
