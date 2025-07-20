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
      localStorage.setItem("memberData", JSON.stringify(member));
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
      localStorage.setItem("memberData", JSON.stringify(member));
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
      const config = {
        headers: {
          "Content-Type": input instanceof FormData ? "multipart/form-data" : "application/json",
        },
        withCredentials: true,
      };
      const result = await axios.post(url, input, config);
      return result.data.member;
    } catch (err) {
      console.log("updateMember error:", err);
      throw err;
    }
  }
  
  
  }
  


export default MemberService;
