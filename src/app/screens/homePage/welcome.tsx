import React from "react";
import { Box, Stack, Container } from "@mui/joy";
import { useGlobals } from "../../../hooks/useGlobals.ts";

export default function Welcome() {
  const { authMember } = useGlobals();

  return (
    <div className="homepage welcome">
      <Container>
        <Stack className="header-frame">
          <Stack className="detail">
            <Box className="head-main-txt">
              다시 오신 것을 환영합니다 {authMember?.memberNick ?? "회원"} 님
            </Box>
            <Box className="wel-txt">도움이 되는 학습</Box>
            <Box className="service-txt">현재와 미래를 위한 스킬들. wisdom 와 시작해보세요.</Box>
          </Stack>
          <Box className="logo-frame">
            <div className="logo-img" />
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
