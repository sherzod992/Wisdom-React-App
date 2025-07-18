import React, { useState, useEffect } from "react";
import { Modal, Box, Stack, Typography, Button } from "@mui/material";
import YouTube from "react-youtube";

const getYouTubeVideoId = (url: string): string | null => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^?&]+)/);
  return match ? match[1] : null;
};

type VideoModalProps = {
  open: boolean;
  onClose: () => void;
  videoLinks: string[];
};

const VideoModal: React.FC<VideoModalProps> = ({ open, onClose, videoLinks }) => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

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
        {selectedVideoId ? (
          <YouTube videoId={selectedVideoId} opts={opts} />
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

            return (
              <Box
                key={index}
                sx={{
                  cursor: "pointer",
                  border: isSelected ? "2px solid #1976d2" : "1px solid #ccc",
                  borderRadius: 1,
                  flexShrink: 0,
                  width: 120,
                  height: 67,
                  position: "relative",
                }}
                onClick={() => setSelectedVideoIndex(index)}
              >
                {videoId ? (
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
