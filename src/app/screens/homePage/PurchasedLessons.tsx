import React, { useState, useEffect } from "react";
import { Box, Container, Stack } from "@mui/material";
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import { CssVarsProvider } from "@mui/joy/styles";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { AspectRatio, CardOverflow } from "@mui/joy";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { retriverPopularLessons } from "./selector.ts";
import { Lesson } from "../../../lib/types/lesson.ts";
import { serverApi } from "../../../lib/types/config.ts";
import VideoModalLP from "../lessonsPage/VideoModelLP.tsx";

const popularLessonsRetriever = createSelector(
  retriverPopularLessons,
  (popularLessons) => ({ popularLessons })
);

export default function PurchasedLessons() {
  const { popularLessons } = useSelector(popularLessonsRetriever);
  const [purchasedLessons, setPurchasedLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 안전한 기본값 설정
  const safeLessons = popularLessons || [];

  useEffect(() => {
    // 구매한 강의들 필터링
    const finishedOrders = localStorage.getItem('finishedOrders');
    if (finishedOrders) {
      const orders = JSON.parse(finishedOrders);
      const purchasedIds = orders.map((order: any) => order._id);
      const purchased = safeLessons.filter(lesson => 
        purchasedIds.includes(lesson._id)
      );
      setPurchasedLessons(purchased);
    }
  }, [safeLessons]);

  const handleOpenModal = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedLesson(null);
    setModalOpen(false);
  };

  if (purchasedLessons.length === 0) {
    return null; // 구매한 강의가 없으면 섹션을 숨김
  }

  return (
    <div className="purchased-lessons-frame">
      <Container maxWidth="xl">
        <Stack className="main">
          <Box className="category-title">학습시작하기</Box>
          <Box className="purchased-cards-frame">
            <CssVarsProvider>
              {purchasedLessons.map((lesson: Lesson) => {
                const imagePath = lesson.lessonImages?.[0]
                  ? `${serverApi}/${lesson.lessonImages[0]}`
                  : "/default.jpg";

                return (
                  <Card 
                    key={lesson._id} 
                    variant="outlined" 
                    className="purchased-card"
                    sx={{ 
                      width: 280, 
                      height: 400,
                      cursor: "pointer",
                      transition: "transform 0.2s ease-in-out",
                      flexShrink: 0, // 스크롤 시 크기 유지
                      "&:hover": {
                        transform: "translateY(-5px)",
                      }
                    }}
                    onClick={() => handleOpenModal(lesson)}
                  >
                    <CardOverflow>
                      <AspectRatio ratio="16/10">
                        <img src={imagePath} alt={lesson.lessonName || 'Purchased Lesson'} />
                      </AspectRatio>
                      {/* 재생 버튼 오버레이 */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                          borderRadius: "50%",
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <PlayArrowIcon sx={{ fontSize: 40, color: "#fff" }} />
                      </Box>
                    </CardOverflow>
                    
                    <Box sx={{ p: 2 }}>
                      <Typography level="title-md" sx={{ mb: 1 }}>
                        {lesson.lessonName || 'Untitled Lesson'}
                      </Typography>
                      <Typography level="body-sm" sx={{ color: 'text.secondary', mb: 2 }}>
                        {lesson.lessonDesc ? lesson.lessonDesc.slice(0, 50) + "..." : "강의 설명"}
                      </Typography>
                      <Button
                        variant="solid"
                        startDecorator={<PlayArrowIcon />}
                        fullWidth
                        sx={{
                          backgroundColor: "#1976d2",
                          "&:hover": {
                            backgroundColor: "#1565c0",
                          },
                        }}
                      >
                        학습 시작
                      </Button>
                    </Box>
                  </Card>
                );
              })}
            </CssVarsProvider>
          </Box>
        </Stack>
      </Container>

      {selectedLesson && (
        <VideoModalLP
          open={modalOpen}
          onClose={handleCloseModal}
          videoLinks={selectedLesson.lessonVideo || []}
          lessonDesc={selectedLesson.lessonDesc ?? ""}
          lessonId={selectedLesson._id}
        />
      )}
    </div>
  );
} 