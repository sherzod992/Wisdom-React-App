import { Box, Container, Stack } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Settings } from "./Settings.tsx";
import "../../../css/usersPage.css";
import React from "react";
import { useGlobals } from "../../../hooks/useGlobals.ts";
import { serverApi } from "../../../lib/types/config.ts";

export default function UserPage() {
  const { authMember } = useGlobals();

  return (
    <div className={"user-page"}>
      <Container>
        <Stack className={"my-page-frame"}>
          <Stack className={"my-page-left"}>
            <Box display={"flex"} flexDirection={"column"}>
              <Box className={"menu-name"}>Modify Member Details</Box>
              <Box className={"menu-content"}>
                <Settings />
              </Box>
            </Box>
          </Stack>

          <Stack className={"my-page-right"}>
            <Box className={"order-info-box"}>
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <div className={"order-user-img"}>
                  <img
                    src={authMember?.memberImage ? 
                      (authMember.memberImage.startsWith('http') ? 
                        authMember.memberImage : 
                        `${serverApi}/${authMember.memberImage}`) : 
                      "/icons/default-user.svg"}
                    className={"order-user-avatar"}
                    alt="User Avatar"
                  />
                  <div className={"order-user-icon-box"}>
                    <img src={"/icons/user-badge.svg"} />
                  </div>
                </div>
                <span className={"order-user-name"}>
                  {authMember?.memberNick || "Guest"}
                </span>
                <span className={"order-user-prof"}>
                  {authMember?.memberStatus || "User"}
                </span>
                <span className={"order-user-prof"}>
                  {authMember?.memberAddress || "No address"}
                </span>
              </Box>
              <Box className={"user-media-box"}>
                <FacebookIcon />
                <InstagramIcon />
                <TelegramIcon />
                <YouTubeIcon />
              </Box>
              <p className={"user-desc"}>
                {authMember?.memberDesk || "No description"}
              </p>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
