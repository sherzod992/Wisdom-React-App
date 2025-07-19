import React from "react";
import { Box, Container, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Footers = styled.div`
  width: 100%;
  height: 590px;
  display: flex;
  background: #343434;
  background-size: cover;
`;

export default function Footer() {
  const authMember = null;

  return (
    <Footers>
      <Container>
        <Stack flexDirection={"row"} sx={{ mt: "94px" }}>
          <Stack flexDirection={"column"} style={{ width: "340px" }}>
            <Box>
              <img className="logo" width={"120px"}  src={"/img/wisdomLogo.png"} />
            </Box>
            <Box className={"foot-desc-txt"}>
             모든 것은 따져 보면 지식에 달려 있고, 이 지식이 전세계적으로 날라가기 위해서는
             우리가 노력하고 있습니다. 우리가 노력하는 것은 핵생과 선생에게 도움을 주기 위해서 이러한 공간을 마련 해 놓았습니다
            </Box>
            <Box className="sns-context">
              <img src={"/icons/facebook.svg"} />
              <img src={"/icons/twitter.svg"} />
              <img src={"/icons/instagram.svg"} />
              <img src={"/icons/youtube.svg"} />
            </Box>
          </Stack>
          <Stack sx={{ ml: "288px" }} flexDirection={"row"}>
            <Stack>
              <Box>
                <Box className={"foot-category-title"}>Bo'limlar</Box>
                <Box className={"foot-category-link"}>
                  <Link to="/">Home</Link>
                  <Link to="/lessons">Lessons</Link>
                  {authMember && <Link to="/orders">OrdersLesson</Link>}
                  <Link to="/help">Help</Link>
                </Box>
              </Box>
            </Stack>
            <Stack sx={{ ml: "100px" }}>
              <Box>
                <Box className={"foot-category-title"}>Find us</Box>
                <Box
                  flexDirection={"column"}
                  sx={{ mt: "20px" }}
                  className={"foot-category-link"}
                  justifyContent={"space-between"}
                >
                  <Box flexDirection={"row"} className={"find-us"}>
                    <span>L.</span>
                    <div>충청남도 아산시</div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>P.</span>
                    <div>01058884005</div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>E.</span>
                    <div>sherzod_dev</div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>H.</span>
                    <div>시간 없으니까 있는 거 그대로 사용하세요</div>
                  </Box>
                </Box>
              </Box>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          style={{ border: "1px solid #C5C8C9", width: "100%", opacity: "0.2" }}
          sx={{ mt: "80px" }}
        ></Stack>
        <Stack className={"copyright-txt"}>
          © Copyright Devex Global, All rights reserved.
        </Stack>
      </Container>
    </Footers>
  );
}
