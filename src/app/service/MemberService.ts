import axios from "axios";
import { serverApi } from "../../lib/types/config";
import { LoginInput, Member, MemberInput } from "../../lib/types/member";

class MemberService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  // 🏆 Eng yaxshi o‘quvchilar/ustozlar ro‘yxatini olish
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

  // 🔐 Tizimga kirgan foydalanuvchi (admin yoki teacher) haqida info
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

  // 📝 Ro‘yxatdan o‘tish
  public async signup(input: MemberInput): Promise<Member> {
    try {
      const url = `${this.path}/member/signup`;
      const result = await axios.post(url, input, { withCredentials: true });
      console.log("signup:", result.data);

      const member: Member = result.data.member;
      localStorage.setItem("memberData", JSON.stringify(member));

      return member;
    } catch (err) {
      console.log("signup error:", err);
      throw err;
    }
  }

  // 🔐 Tizimga kirish
  public async login(input: LoginInput): Promise<Member> {
    try {
      const url = `${this.path}/member/login`;
      const result = await axios.post(url, input, { withCredentials: true });
      console.log("login:", result.data);

      const member: Member = result.data.member;
      localStorage.setItem("memberData", JSON.stringify(member));

      return member;
    } catch (err) {
      console.log("login error:", err);
      throw err;
    }
  }

  // 🚪 Chiqish
  public async logout(): Promise<void> {
    try {
      const url = `${this.path}/member/logout`;
      const result = await axios.post(url, {}, { withCredentials: true });
      localStorage.removeItem("memberData");
      console.log("logout:", result.data);
      return;
    } catch (err) {
      console.log("logout error:", err);
      throw err;
    }
  }
}

export default MemberService;
