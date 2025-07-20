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
      console.log("Starting profile update...");
      console.log("Current authMember:", authMember);
      
      const formData = new FormData();
      formData.append("memberNick", memberNick || authMember?.memberNick || "");
      formData.append("memberPhone", memberPhone || authMember?.memberPhone || "");
      formData.append("memberAddress", memberAddress || authMember?.memberAddress || "");
      formData.append("memberDesc", memberDesc || authMember?.memberDesk || "");
      
      // 멤버 ID 추가 (서버에서 필요할 수 있음)
      if (authMember?._id) {
        formData.append("memberId", authMember._id);
      }

      if (file) {
        console.log("File to upload:", file.name, file.size);
        formData.append("memberImage", file);
      }

      // FormData 내용 로깅
      for (let [key, value] of formData.entries()) {
        console.log(`FormData ${key}:`, value);
      }

      // UpdateMember ga formData ni uzatishni unutmaymiz
      console.log("Calling updateMember...");
      const updatedMember = await memberService.updateMember(formData);
      console.log("Update successful, received:", updatedMember);

      // 업데이트된 멤버 정보가 유효한지 확인
      if (!updatedMember || !updatedMember._id) {
        throw new Error("서버에서 유효하지 않은 멤버 정보를 받았습니다.");
      }

      // Global authMember 업데이트 (localStorage도 자동으로 동기화됨)
      if (setAuthMember) {
        setAuthMember(updatedMember);
        console.log("AuthMember updated in context");
        
        // 업데이트 후 실제 상태 확인
        setTimeout(() => {
          const currentMember = localStorage.getItem("memberData");
          console.log("Final localStorage state:", currentMember);
        }, 100);
      }

      // 업로드 후 상태 초기화
      setFile(null);
      setPreviewImage(null);

      alert("Profile updated successfully!");
    } catch (error: any) {
      console.error("Update failed - Full error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      // 401 Unauthorized 오류인 경우 (인증 만료)
      if (error.response?.status === 401) {
        console.log("Authentication expired, logging out...");
        alert("인증이 만료되었습니다. 다시 로그인해주세요.");
        if (setAuthMember) {
          setAuthMember(null);
        }
        // 로그인 페이지로 리디렉션하거나 추가 처리
        return;
      }
      
      // 기타 오류
      alert(`Failed to update profile: ${error.response?.data?.message || error.message}`);
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
          <span>{file ? "새 이미지 선택됨" : "사진 업로드"}</span>
          <p>{file ? `선택된 파일: ${file.name}` : "JPG, JPEG, PNG 파일만 업로드 가능합니다!"}</p>
          {file && (
            <p style={{ color: 'green', fontSize: '12px' }}>
              기존 이미지가 이 이미지로 교체됩니다
            </p>
          )}
          <div className={"up-del-box"}>
            <Button component="label" variant={file ? "contained" : "outlined"}>
              <CloudDownloadIcon />
              {file ? "" : ""}
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
