import React, { useState, useEffect } from "react";
import { Modal, Box, Stack, Typography, Button } from "@mui/material";
import YouTube from "react-youtube";
import LockIcon from "@mui/icons-material/Lock";

import useBasket from "../../../hooks/useBasket.ts";
import { useGlobals } from "../../../hooks/useGlobals.ts";
import { serverApi } from "../../../lib/types/config.ts";

const getYouTubeVideoId = (url: string): string | null => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^?&]+)/);
  return match ? match[1] : null;
};

type VideoModalProps = {
  open: boolean;
  onClose: () => void;
  videoLinks: string[];
  lessonId?: string;
};

const VideoModal: React.FC<VideoModalProps> = ({ open, onClose, videoLinks, lessonId }) => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const { cartItems } = useBasket();
  const { authMember } = useGlobals();


  // 강의가 구매되었는지 확인하는 함수
  const isPurchased = () => {
    if (!lessonId) return false;
    // 로컬 스토리지에서 완료된 주문 확인
    const finishedOrders = localStorage.getItem('finishedOrders');
    if (finishedOrders) {
      const orders = JSON.parse(finishedOrders);
      return orders.some((order: any) => order._id === lessonId);
    }
    return false;
  };

  // 비디오가 재생 가능한지 확인하는 함수
  const isVideoPlayable = (index: number) => {
    return index === 0 || isPurchased(); // 첫 번째 비디오 또는 구매한 강의
  };



  // 동영상 썸네일 클릭 핸들러
  const handleVideoClick = (index: number) => {
    if (!isVideoPlayable(index)) return;
    setSelectedVideoIndex(index);
  };

  // Videolar o'zganda tanlangan videoni birinchi videoga o'rnatamiz
  useEffect(() => {
    setSelectedVideoIndex(0);
  }, [videoLinks]);



  const selectedVideoId = getYouTubeVideoId(videoLinks[selectedVideoIndex]);

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
        autoplay: 1,
        rel: 0,            
        modestbranding: 0,
        controls: 1,
        showinfo: 1,
        
    },
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 25,
          p: 3,
          borderRadius: 15,
          width: { xs: "95%", sm: 700 },
          maxHeight: "90vh",
          overflowY: "auto",
          outline: "none",
        }}
      >
        {/* Katta video */}
        {selectedVideoId && isVideoPlayable(selectedVideoIndex) ? (
          <YouTube videoId={selectedVideoId} opts={opts} />
        ) : selectedVideoId && !isVideoPlayable(selectedVideoIndex) ? (
          <Box
            sx={{
              width: "640px",
              height: "390px",
              backgroundColor: "#000",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              position: "relative",
              mx: "auto",
            }}
          >
            <LockIcon sx={{ fontSize: 60, mb: 2, opacity: 0.7 }} />
            <Typography variant="h6" sx={{ textAlign: "center", mb: 1 }}>
              이 강의는 결제 후 시청 가능합니다
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              강의를 구매하시면 모든 동영상을 시청하실 수 있습니다
            </Typography>
          </Box>
        ) : (
          <Typography>Video yuklanmadi</Typography>
        )}

        {/* Pastdagi videolar ro'yxati */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mt: 2,
            overflowX: "auto",
            pb: 1,
          }}
        >
          {videoLinks.map((url, index) => {
            const videoId = getYouTubeVideoId(url);
            const isSelected = index === selectedVideoIndex;
            const canPlay = isVideoPlayable(index);

            return (
              <Box
                key={index}
                sx={{
                  cursor: canPlay ? "pointer" : "not-allowed",
                  border: isSelected ? "2px solid #1976d2" : "1px solid #ccc",
                  borderRadius: 1,
                  flexShrink: 0,
                  width: 120,
                  height: 67,
                  position: "relative",
                  opacity: canPlay ? 1 : 0.4, // 재생 불가한 비디오는 투명하게
                }}
                onClick={() => canPlay && handleVideoClick(index)}
              >
                {videoId ? (
                  <>
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                      alt={`Video ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: isSelected ? 1 : 0.7,
                      }}
                    />
                    {/* 잠금 아이콘 표시 */}
                    {!canPlay && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                          borderRadius: "50%",
                          p: 1,
                        }}
                      >
                        <LockIcon sx={{ fontSize: 20, color: "#fff" }} />
                      </Box>
                    )}
                    {/* 강의 번호 표시 */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 4,
                        left: 4,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "#fff",
                        fontSize: 10,
                        px: 0.5,
                        py: 0.2,
                        borderRadius: 0.5,
                      }}
                    >
                      {index + 1}강
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 12,
                    }}
                  >
                    No thumbnail
                  </Box>
                )}
              </Box>
            );
          })}
        </Stack>



        {/* Yopish tugmasi */}
        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default VideoModal;
