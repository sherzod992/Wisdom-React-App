import axios from "axios";
import { serverApi } from "../../lib/types/config.ts";
import { LoginInput, Member, MemberInput } from "../../lib/types/member.ts";

class MemberService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getTopUsers(): Promise<Member[]> {
    try {
      const url = `${this.path}/member/top-users`;
      const result = await axios.get(url);
      console.log("getTopUsers:", result.data);
      return result.data;
    } catch (err) {
      console.log("getTopUsers error:", err);
      throw err;
    }
  }

  public async getCurrentMember(): Promise<Member> {
    try {
      const url = `${this.path}/member/detail`;
      const result = await axios.get(url, { withCredentials: true });
      console.log("getCurrentMember:", result.data);
      return result.data;
    } catch (err) {
      console.log("getCurrentMember error:", err);
      throw err;
    }
  }

  public async signup(input: MemberInput): Promise<Member> {
    try {
      const url = `${this.path}/member/signup`;
      const result = await axios.post(url, input, { withCredentials: true });
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
    } catch (err) {
      console.log("signup error:", err);
      throw err;
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    try {
      const url = `${this.path}/member/login`;
      const result = await axios.post(url, input, { withCredentials: true });
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
    } catch (err) {
      console.log("login error:", err);
      throw err;
    }
  }

  public async logout(): Promise<void> {
    try {
      const url = `${this.path}/member/logout`;
      console.log("로그아웃 요청 URL:", url);
      
      // 타임아웃 설정 (5초)
      const result = await axios.post(url, {}, { 
        withCredentials: true,
        timeout: 5000 
      });
      
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
      const url = `${this.path}/member/update`;
      console.log("UpdateMember URL:", url);
      console.log("UpdateMember input type:", input instanceof FormData ? "FormData" : "JSON");
      
      const config = {
        headers: {
          "Content-Type": input instanceof FormData ? "multipart/form-data" : "application/json",
        },
        withCredentials: true,
        timeout: 30000, // 30초 타임아웃
      };
      
      console.log("Sending update request...");
      const result = await axios.post(url, input, config);
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
