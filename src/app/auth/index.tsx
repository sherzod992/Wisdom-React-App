import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, Backdrop, Fade, Fab, Stack, TextField } from "@mui/material";
import styled from "styled-components";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { T } from "../../lib/types/common.ts";
import { LoginInput, MemberInput } from "../../lib/types/member.ts";
import MemberService from "../service/MemberService.ts";
import { sweetLoginErrorHandling, sweetSignupErrorHandling } from "../../lib/sweetAlert.ts";
import { useGlobals } from "../../hooks/useGlobals.ts";

// MUI modal style
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 2),
  },
}));

const ModalImg = styled.img`
  width: 62%;
  height: 100%;
  border-radius: 10px;
  background: #000;
  margin-top: 9px;
  margin-left: 10px;
`;

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
}

export default function AuthenticationModal(props: AuthenticationModalProps) {
  const { signupOpen, loginOpen, handleSignupClose, handleLoginClose } = props;
  const classes = useStyles();

  // 상태 관리
  const [memberNick, setMemberNick] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");
  const { setAuthMember } = useGlobals();

  // Input 핸들러들
  const handleUserName = (e: T) => {
    setMemberNick(e.target.value);
  };

  const handleUserPhone = (e: T) => {
    setMemberPhone(e.target.value);
  };

  const handlePassword = (e: T) => {
    setMemberPassword(e.target.value);
  };

  // Enter 키 처리
  const handleKeyDown = (e: T) => {
    if (e.key === "Enter") {
      if (signupOpen) {
        handleSignupRequest();
      } else if (loginOpen) {
        handleLoginRequest();
      }
    }
  };

  // 입력값 초기화
  const resetInputs = () => {
    setMemberNick("");
    setMemberPhone("");
    setMemberPassword("");
  };

  // 회원가입 요청
  const handleSignupRequest = async () => {
    try {
      // 입력값 검증
      const isFulfilled = memberNick !== "" && memberPhone !== "" && memberPassword !== "";
      
      if (!isFulfilled) {
        throw new Error("모든 필드를 입력해주세요.");
      }

      const signupInput: MemberInput = {
        memberNick: memberNick,
        memberPhone: memberPhone,
        memberPassword: memberPassword,
      };

      const memberService = new MemberService();
      const result = await memberService.signup(signupInput);
      
      setAuthMember(result);
      resetInputs();
      handleSignupClose();
      
    } catch (err) {
      console.error("회원가입 에러:", err);
      handleSignupClose();
      resetInputs();
      await sweetSignupErrorHandling(err);
    }
  };

  // 로그인 요청
  const handleLoginRequest = async () => {
    try {
      // 입력값 검증
      const isFulfilled = memberNick !== "" && memberPassword !== "";
      
      if (!isFulfilled) {
        throw new Error("아이디와 비밀번호를 입력해주세요.");
      }

      const loginInput: LoginInput = {
        memberNick: memberNick,
        memberPassword: memberPassword,
      };

      const memberService = new MemberService();
      const result = await memberService.login(loginInput);
      
      setAuthMember(result);
      resetInputs();
      handleLoginClose();
      
    } catch (err) {
      console.error("로그인 에러:", err);
      handleLoginClose();
      resetInputs();
      await sweetLoginErrorHandling(err);
    }
  };

  return (
    <div>
      {/* === 회원가입 모달 === */}
      <Modal
        aria-labelledby="signup-modal-title"
        aria-describedby="signup-modal-description"
        className={classes.modal}
        open={signupOpen}
        onClose={handleSignupClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={signupOpen}>
          <Stack className={classes.paper} direction="row" sx={{ width: "800px" }}>
            <ModalImg src="/img/auth.webp" alt="회원가입" />
            <Stack sx={{ marginLeft: "69px", alignItems: "center" }}>
              <h2>회원가입</h2>
              <TextField
                sx={{ marginTop: "7px" }}
                id="signup-username"
                label="닉네임"
                placeholder="사용자 이름을 입력하세요"
                variant="outlined"
                value={memberNick}
                onChange={handleUserName}
                onKeyDown={handleKeyDown}
              />
              <TextField
                sx={{ my: "17px" }}
                id="signup-phone"
                label="전화번호"
                placeholder="01012345678"
                variant="outlined"
                value={memberPhone}
                onChange={handleUserPhone}
                onKeyDown={handleKeyDown}
              />
              <TextField
                id="signup-password"
                label="비밀번호"
                placeholder="비밀번호를 입력하세요"
                variant="outlined"
                type="password"
                value={memberPassword}
                onChange={handlePassword}
                onKeyDown={handleKeyDown}
              />
              <Fab
                sx={{ marginTop: "30px", width: "120px" }}
                variant="extended"
                color="primary"
                onClick={handleSignupRequest}
              >
                <PersonAddIcon sx={{ mr: 1 }} />
                회원가입
              </Fab>
            </Stack>
          </Stack>
        </Fade>
      </Modal>

      {/* === 로그인 모달 === */}
      <Modal
        aria-labelledby="login-modal-title"
        aria-describedby="login-modal-description"
        className={classes.modal}
        open={loginOpen}
        onClose={handleLoginClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={loginOpen}>
          <Stack className={classes.paper} direction="row" sx={{ width: "700px" }}>
            <ModalImg src="/img/auth.webp" alt="로그인" />
            <Stack
              sx={{
                marginLeft: "65px",
                marginTop: "25px",
                alignItems: "center",
              }}
            >
              <h2>로그인</h2>
              <TextField
                id="login-username"
                label="닉네임"
                placeholder="사용자 이름을 입력하세요"
                variant="outlined"
                sx={{ my: "10px" }}
                value={memberNick}
                onChange={handleUserName}
                onKeyDown={handleKeyDown}
              />
              <TextField
                id="login-password"
                label="비밀번호"
                placeholder="비밀번호를 입력하세요"
                variant="outlined"
                type="password"
                value={memberPassword}
                onChange={handlePassword}
                onKeyDown={handleKeyDown}
              />
              <Fab
                sx={{ marginTop: "27px", width: "120px" }}
                variant="extended"
                color="primary"
                onClick={handleLoginRequest}
              >
                <LoginIcon sx={{ mr: 1 }} />
                로그인
              </Fab>
            </Stack>
          </Stack>
        </Fade>
      </Modal>
    </div>
  );
}
