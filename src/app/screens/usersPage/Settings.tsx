import { Box } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import { useGlobals } from "../../../hooks/useGlobals.ts";
import MemberService from "../../service/MemberService.ts";
import { serverApi } from "../../../lib/types/config.ts";

const memberService = new MemberService();

export function Settings() {
  const { authMember, setAuthMember } = useGlobals();

  // Form state (memberDesc uchun typo tuzatildi)
  const [memberNick, setMemberNick] = useState(authMember?.memberNick || "");
  const [memberPhone, setMemberPhone] = useState(authMember?.memberPhone || "");
  const [memberAddress, setMemberAddress] = useState(authMember?.memberAddress || "");
  const [memberDesc, setMemberDesc] = useState(authMember?.memberDesk || "");

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // 미리보기 이미지 생성
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("memberNick", memberNick);
      formData.append("memberPhone", memberPhone);
      formData.append("memberAddress", memberAddress);
      formData.append("memberDesc", memberDesc);

      if (file) {
        formData.append("memberImage", file);
      }

      // UpdateMember ga formData ni uzatishni unutmaymiz
      const updatedMember = await memberService.updateMember(formData);

      // Global authMember ni yangilash
      if (setAuthMember) {
        setAuthMember(updatedMember);
      }

      // 업로드 후 상태 초기화
      setFile(null);
      setPreviewImage(null);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <Box className={"settings"}>
      <Box className={"member-media-frame"}>
        <img
          src={previewImage || 
            (authMember?.memberImage ? 
              (authMember.memberImage.startsWith('http') ? 
                authMember.memberImage : 
                `${serverApi}/${authMember.memberImage}`) : 
              "/icons/default-user.svg")}
          className={"mb-image"}
          alt="User avatar"
        />
        <div className={"media-change-box"}>
          <span>{file ? "새 이미지 선택됨" : "Upload image"}</span>
          <p>{file ? `선택된 파일: ${file.name}` : "JPG, JPEG, PNG formats only!"}</p>
          {file && (
            <p style={{ color: 'green', fontSize: '12px' }}>
              기존 이미지가 이 이미지로 교체됩니다
            </p>
          )}
          <div className={"up-del-box"}>
            <Button component="label" variant={file ? "contained" : "outlined"}>
              <CloudDownloadIcon />
              {file ? "다른 이미지 선택" : "이미지 선택"}
              <input type="file" hidden onChange={handleFileChange} accept="image/*" />
            </Button>
            {file && (
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={() => {
                  setFile(null);
                  setPreviewImage(null);
                }}
                style={{ marginLeft: '8px' }}
              >
                취소
              </Button>
            )}
          </div>
        </div>
      </Box>

      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"}>Username</label>
          <input
            className={"spec-input mb-nick"}
            type="text"
            placeholder={"Martin"}
            value={memberNick}
            name="memberNick"
            onChange={(e) => setMemberNick(e.target.value)}
          />
        </div>
      </Box>

      <Box className={"input-frame"}>
        <div className={"short-input"}>
          <label className={"spec-label"}>Phone</label>
          <input
            className={"spec-input mb-phone"}
            type="text"
            placeholder={"no phone"}
            value={memberPhone}
            name="memberPhone"
            onChange={(e) => setMemberPhone(e.target.value)}
          />
        </div>
        <div className={"short-input"}>
          <label className={"spec-label"}>Address</label>
          <input
            className={"spec-input mb-address"}
            type="text"
            placeholder={"no address"}
            value={memberAddress}
            name="memberAddress"
            onChange={(e) => setMemberAddress(e.target.value)}
          />
        </div>
      </Box>

      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"}>Description</label>
          <textarea
            className={"spec-textarea mb-description"}
            placeholder={"no description"}
            value={memberDesc}
            name="memberDesc"
            onChange={(e) => setMemberDesc(e.target.value)}
          />
        </div>
      </Box>

      <Box className={"save-box"}>
        <Button variant={"contained"} onClick={handleSubmit}>
          Save
        </Button>
      </Box>
    </Box>
  );
}
