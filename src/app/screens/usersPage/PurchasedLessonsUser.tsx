import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { retriverPopularLessons } from "../homePage/selector.ts";
import { Lesson } from "../../../lib/types/lesson.ts";
import { serverApi } from "../../../lib/types/config.ts";
import VideoModalLP from "../lessonsPage/VideoModelLP.tsx";

const popularLessonsRetriever = createSelector(
  retriverPopularLessons,
  (popularLessons) => ({ popularLessons })
);

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  orderId: string;
  status: 'paused' | 'finished';
  orderDate: Date;
}

export default function PurchasedLessonsUser() {
  const { popularLessons } = useSelector(popularLessonsRetriever);
  const [purchasedLessons, setPurchasedLessons] = useState<Lesson[]>([]);
  const [purchasedOrders, setPurchasedOrders] = useState<OrderItem[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 안전한 기본값 설정
  const safeLessons = popularLessons || [];

  useEffect(() => {
    // 구매한 강의들 필터링
    const finishedOrders = localStorage.getItem('finishedOrders');
    if (finishedOrders) {
      try {
        const orders: OrderItem[] = JSON.parse(finishedOrders);
        setPurchasedOrders(orders);
        
        const purchasedIds = orders.map((order: OrderItem) => order._id);
        const purchased = safeLessons.filter(lesson => 
          purchasedIds.includes(lesson._id)
        );
        setPurchasedLessons(purchased);
      } catch (error) {
        console.error("Error parsing finishedOrders:", error);
      }
    }
    setIsLoading(false);
  }, [safeLessons]);

  const handleOpenModal = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedLesson(null);
    setModalOpen(false);
  };

  // 주문 정보 찾기
  const getOrderInfo = (lessonId: string) => {
    return purchasedOrders.find(order => order._id === lessonId);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (purchasedLessons.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
          구매한 강의가 없습니다
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          새로운 강의를 구매해보세요!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        내 강의 ({purchasedLessons.length}개)
      </Typography>
      
      <Grid container spacing={3}>
        {purchasedLessons.map((lesson: Lesson) => {
          const imagePath = lesson.lessonImages?.[0]
            ? `${serverApi}/${lesson.lessonImages[0]}`
            : "/default.jpg";
          
          const orderInfo = getOrderInfo(lesson._id);

          return (
            <Grid item xs={12} sm={6} md={4} key={lesson._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: "pointer",
                  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  }
                }}
                onClick={() => handleOpenModal(lesson)}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={imagePath}
                    alt={lesson.lessonName || 'Purchased Lesson'}
                    sx={{ objectFit: 'cover' }}
                  />
                  
                  {/* 재생 버튼 오버레이 */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      borderRadius: "50%",
                      p: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PlayArrowIcon sx={{ fontSize: 32, color: "#fff" }} />
                  </Box>

                  {/* 구매완료 배지 */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      backgroundColor: "rgba(76, 175, 80, 0.9)",
                      color: "#fff",
                      borderRadius: "16px",
                      px: 1.5,
                      py: 0.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                      구매완료
                    </Typography>
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', lineHeight: 1.3 }}>
                    {lesson.lessonTitle || lesson.lessonName || 'Untitled Lesson'}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary', 
                      mb: 2, 
                      flexGrow: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      '-webkit-line-clamp': 2,
                      '-webkit-box-orient': 'vertical',
                    }}
                  >
                    {lesson.lessonDesc || "강의 설명이 없습니다."}
                  </Typography>

                  {/* 주문 정보 */}
                  {orderInfo && (
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          구매일: {new Date(orderInfo.orderDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                        ${orderInfo.price}
                      </Typography>
                    </Box>
                  )}

                  <Button
                    variant="contained"
                    startIcon={<PlayArrowIcon />}
                    fullWidth
                    sx={{
                      backgroundColor: "#1976d2",
                      "&:hover": {
                        backgroundColor: "#1565c0",
                      },
                      py: 1.5,
                      fontWeight: 'bold'
                    }}
                  >
                    학습 시작하기
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* 비디오 모달 */}
      {selectedLesson && (
        <VideoModalLP
          open={modalOpen}
          onClose={handleCloseModal}
          videoLinks={selectedLesson.lessonVideo || []}
          lessonDesc={selectedLesson.lessonDesc ?? ""}
          lessonId={selectedLesson._id}
        />
      )}
    </Box>
  );
} 