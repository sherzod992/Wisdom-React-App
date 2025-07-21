import React, { useState } from "react";
import {
  Box,
  Container,
  Divider,
  Stack,
  Button,
} from "@mui/joy";
import {
  Card,
  CardCover,
  CardContent,
  Typography,
  CardOverflow,
  AspectRatio,
  CssVarsProvider
} from "@mui/joy";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { retriverPopularLessons } from "./selector.ts";
import { Lesson } from "../../../lib/types/lesson.ts";
import { CartItem } from "../../../lib/types/search.ts";
import { serverApi } from "../../../lib/types/config.ts";
import VideoModal from "./VideoModal.tsx";
import { sweetTopSuccessAlert } from "../../../lib/sweetAlert.ts";
import useBasket from "../../../hooks/useBasket.ts";
import { usePurchasedLessons } from "../../../hooks/usePurchasedLessons.ts";

// Redux selector
const popularLessonsRetriever = createSelector(
  retriverPopularLessons,
  (popularLessons) => ({ popularLessons })
);

interface PopularLessonsProps {
  onAdd: (item: CartItem) => void;
}

export default function PopularLessons({ onAdd }: PopularLessonsProps) {
  const { popularLessons } = useSelector(popularLessonsRetriever);
  const { cartItems } = useBasket();
  const { isPurchased } = usePurchasedLessons();
  const [selectedVideos, setSelectedVideos] = useState<string[] | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 안전한 기본값 설정
  const safeLessons = popularLessons || [];

  const handleOpenModal = (lessonVideo: string[], lessonId: string) => {
    setSelectedVideos(lessonVideo);
    setSelectedLessonId(lessonId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedVideos(null);
    setSelectedLessonId(null);
    setModalOpen(false);
  };

  const handleDirectPurchase = async (e: React.MouseEvent, lesson: Lesson) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    
    // 이미 구매했는지 확인
    if (isPurchased(lesson._id)) {
      await sweetTopSuccessAlert(`${lesson.lessonName}은(는) 이미 구매한 강의입니다!`, 2000);
      return;
    }
    
    // 바로 구매 처리 - pausedOrders에 추가
    const orderItem = {
      _id: lesson._id,
      name: lesson.lessonName,
      price: lesson.lessonPrice,
      image: lesson.lessonImages?.[0] || "",
      quantity: 1,
      orderId: `order_${Date.now()}`,
      status: 'paused' as const,
      orderDate: new Date(),
    };
    
    // localStorage에 pausedOrders 저장
    const existingPausedOrders = localStorage.getItem('pausedOrders');
    const pausedOrders = existingPausedOrders ? JSON.parse(existingPausedOrders) : [];
    pausedOrders.push(orderItem);
    localStorage.setItem('pausedOrders', JSON.stringify(pausedOrders));
    
    await sweetTopSuccessAlert(`${lesson.lessonName}이(가) 주문목록에 추가되었습니다! 주문 페이지에서 결제를 완료해주세요.`, 3000);
  };

  const handleAddToCart = async (e: React.MouseEvent, lesson: Lesson) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    
    // 이미 장바구니에 있는지 확인
    const exist = cartItems.find(item => item._id === lesson._id);
    
    if (exist) {
      await sweetTopSuccessAlert(`${lesson.lessonName}은(는) 이미 장바구니에 있습니다!`, 2000);
      return;
    }
    
    const cartItem: CartItem = {
      _id: lesson._id,
      name: lesson.lessonName,
      price: lesson.lessonPrice,
      image: lesson.lessonImages?.[0] || "",
      quantity: 1
    };
    onAdd(cartItem);
    await sweetTopSuccessAlert(`${lesson.lessonName}이(가) 장바구니에 추가되었습니다!`, 2000);
  };

  return (
    <div className="popular-dishes-frame">
      <Container maxWidth="xl">
        <Stack className="popular-section">
          <Box className="category-title">인기가 많은 수업 및 다음에 학습할 것</Box>
          <Box className="cards-frame">
            {safeLessons.length !== 0 ? (
              safeLessons.map((lesson: Lesson) => {
                const imagePath = lesson.lessonImages?.[0]
                  ? `${serverApi}/${lesson.lessonImages[0]}`
                  : "/default.jpg";

                return (
                  <CssVarsProvider key={lesson._id}>
                    <Card
                      variant="outlined"
                      sx={{ width: 260, cursor: "pointer", position: "relative" }}
                      onClick={() => handleOpenModal(lesson.lessonVideo || [], lesson._id)}
                    >
                      <CardOverflow>
                        <AspectRatio ratio="1">
                          <img
                            src={imagePath}
                            loading="lazy"
                            alt={lesson.lessonTitle || lesson.lessonName || 'Lesson'}
                          />
                        </AspectRatio>
                        
                        {/* 장바구니 버튼 - 제일 위쪽 */}
                        {!isPurchased(lesson._id) && (
                          <Button
                            variant="solid"
                            size="sm"
                            startDecorator={<ShoppingCartIcon />}
                            onClick={(e) => handleAddToCart(e, lesson)}
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              fontSize: "0.7rem",
                              padding: "3px 6px",
                              backgroundColor: "#1976d2",
                              "&:hover": {
                                backgroundColor: "#1565c0",
                              },
                              zIndex: 1,
                            }}
                            className="cart-button"
                          >
                            장바구니
                          </Button>
                        )}

                      </CardOverflow>

                      <CardContent sx={{ padding: "12px", position: "relative" }}>
                        <Typography
                          sx={{
                            fontWeight: 'bold',
                            color: 'black',
                            fontSize: '1.1rem',
                            mb: 0.5
                          }}
                        >
                          ${lesson.lessonPrice || 0}
                        </Typography>
                        <Typography level="title-sm" sx={{ fontSize: "0.9rem" }}>
                          {lesson.lessonTitle && lesson.lessonTitle.length > 30 
                            ? lesson.lessonTitle.slice(0, 30) + "..." 
                            : lesson.lessonTitle || lesson.lessonName || 'Untitled Lesson'}
                        </Typography>
                        <Typography level="body-xs" sx={{ mt: 0.5, fontSize: "0.8rem" }}>
                          {lesson.lessonName || 'Unknown'} Lessons
                        </Typography>
                        
                        {/* 구매하기 버튼 또는 구매완료 버튼 */}
                        {isPurchased(lesson._id) ? (
                          <Button
                            variant="soft"
                            size="sm"
                            startDecorator={<CheckCircleIcon />}
                            disabled
                            sx={{
                              position: "absolute",
                              top: 50,
                              right: 8,
                              backgroundColor: "rgba(76, 175, 80, 0.2)",
                              color: "#4caf50",
                              cursor: "default",
                              fontSize: "0.7rem",
                              padding: "3px 6px",
                              "&:hover": {
                                backgroundColor: "rgba(76, 175, 80, 0.2)",
                              }
                            }}
                            className="purchased-button"
                          >
                            구매완료
                          </Button>
                        ) : (
                          <Button
                            variant="solid"
                            size="sm"
                            startDecorator={<LocalMallIcon />}
                            onClick={(e) => handleDirectPurchase(e, lesson)}
                            sx={{
                              position: "absolute",
                              top: 50,
                              right: 8,
                              fontSize: "0.7rem",
                              padding: "3px 6px",
                              backgroundColor: "#FF6B6B",
                              "&:hover": {
                                backgroundColor: "#FF5252",
                              }
                            }}
                            className="purchase-button"
                          >
                            구매하기
                          </Button>
                        )}
                      </CardContent>

                      <CardOverflow variant="soft" sx={{ bgcolor: 'background.level2', padding: "8px" }}>
                        <Divider inset="context" />
                        <CardContent orientation="horizontal" sx={{ gap: 1, padding: "4px 8px" }}>
                          <Divider orientation="vertical" />
                          <Typography
                            level="body-xs"
                            textColor="text.secondary"
                            sx={{ fontWeight: 'md', display: 'flex', alignItems: 'center', fontSize: "0.75rem" }}
                          >
                            <DescriptionOutlinedIcon sx={{ fontSize: 14, mr: 0.5 }} />
                            {lesson.lessonDesc
                              ? lesson.lessonDesc.slice(0, 20) + "..."
                              : "No description"}
                          </Typography>

                        </CardContent>
                      </CardOverflow>
                    </Card>
                  </CssVarsProvider>
                );
              })
            ) : (
              <Box className="no-data">Popular lessons are not available!</Box>
            )}
          </Box>
        </Stack>
      </Container>

      {selectedVideos && (
        <VideoModal 
          open={modalOpen} 
          onClose={handleCloseModal} 
          videoLinks={selectedVideos} 
          lessonId={selectedLessonId || undefined}
        />
      )}
    </div>
  );
}