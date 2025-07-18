import React, { useState, useEffect, useRef } from "react";
import { Modal, Box, Stack, Typography, Button } from "@mui/material";
import YouTube, { YouTubePlayer } from "react-youtube";

const getYouTubeVideoId = (url: string): string | null => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^?&]+)/);
  return match ? match[1] : null;
};

type VideoModalProps = {
  open: boolean;
  onClose: () => void;
  videoLinks: string[];
  lessonDesc: string;
};

const VideoModalLP: React.FC<VideoModalProps> = ({
  open,
  onClose,
  videoLinks,
  lessonDesc,
}) => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const playerRef = useRef<YouTubePlayer | null>(null);

  // Videolar o'zganda tanlangan videoni birinchi videoga o'rnatamiz
  useEffect(() => {
    setSelectedVideoIndex(0);
  }, [videoLinks]);

  // Video oynasi tayyor bo'lganda player instance saqlaymiz
  const onReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target;
    // Videoni pauza holatida boshlash uchun autoplay ni olib tashladik
    playerRef.current.pauseVideo();
  };

  // Videoni o‘ynatishni boshlash uchun funksiya (kerak bo‘lsa ishlatiladi)
  const playVideo = () => {
    playerRef.current?.playVideo();
  };

  // Hozircha autoplay o‘chirilgan

  const selectedVideoId = getYouTubeVideoId(videoLinks[selectedVideoIndex]);

  const opts = {
    height: "390",
    width: "500",
    playerVars: {
      autoplay: 0, // Autoplay o‘chirilgan — videoni faqat play tugmasi bosilganda boshlaydi
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
          borderRadius: 2,
          width: { xs: "95%", sm: "90vw", md: 900 },
          maxHeight: "90vh",
          overflowY: "auto",
          outline: "none",
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Mobilda ustma-ust, desktopda yonma-yon
          gap: 3,
        }}
      >
        {/* Video va videolar ro'yxati */}
        <Box sx={{ flex: "0 0 65%" }}>
          {/* Katta video */}
          {selectedVideoId ? (
            <YouTube videoId={selectedVideoId} opts={opts} onReady={onReady} />
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
        </Box>

        {/* Lesson Description */}
        <Box
          sx={{
            flex: "0 0 35%",
            overflowY: "auto",
            maxHeight: "70vh",
            borderLeft: { md: "1px solid #ccc" },
            pl: { md: 2 },
            cursor: "default",
            userSelect: "text", // Matnni belgilash mumkin
          }}
          onClick={(e) => e.stopPropagation()} // lessonDesc click videoni o‘ynamasligi uchun
        >
          <Typography variant="h6" mb={1}>
            Lesson Desc
          </Typography>
          <Typography
            variant="body1"
            
            sx={{ whiteSpace: "pre-line" }} // \n ishlasa ham chiroyli ko‘rinadi
          >
            {lessonDesc || "Description mavjud emas"}
          </Typography>
        </Box>

        {/* Yopish tugmasi */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
        >
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default VideoModalLP;
