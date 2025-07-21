import React, { useState } from "react";

import { Container, Stack } from "@mui/material";
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import {CssVarsProvider} from "@mui/joy/styles"

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { AspectRatio, CardOverflow, Divider, Button, Box } from "@mui/joy";

import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { retriverNewLessons } from "./selector.ts";
import { Lesson } from "../../../lib/types/lesson.ts";
import { CartItem } from "../../../lib/types/search.ts";
import { serverApi } from "../../../lib/types/config.ts";
import { sweetTopSuccessAlert } from "../../../lib/sweetAlert.ts";
import useBasket from "../../../hooks/useBasket.ts";
import { usePurchasedLessons } from "../../../hooks/usePurchasedLessons.ts";
import VideoModal from "./VideoModal.tsx";

const newLessonsRetriever = createSelector (
    retriverNewLessons, 
    (newLessons)=>({newLessons}));

interface NewLessonsProps {
  onAdd: (item: CartItem) => void;
}

export default function NewLessons({ onAdd }: NewLessonsProps) {
    const {newLessons}= useSelector(newLessonsRetriever)
    const { cartItems } = useBasket();
    const { isPurchased } = usePurchasedLessons();
    
    // 안전한 기본값 설정
    const safeLessons = newLessons || [];
    
    // 동영상 모달 상태
    const [selectedVideos, setSelectedVideos] = useState<string[] | null>(null);
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

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
    <div className="new-products-frame">
    <Container maxWidth="xl">
        <Stack className="main">
            <Box className="category-title">새로운 강의</Box>
            <Box className="cards-frame">
                <CssVarsProvider>
                    {safeLessons.length !== 0 ? (
                        safeLessons.map((lesson:Lesson) => {
                            const imagePath =
                            lesson.lessonImages?.[0]
                              ? `${serverApi}/${lesson.lessonImages[0]}`
                              : "/default.jpg"; // fallback image  
                                      
                            return(
                                <Card 
                                  key={lesson._id} 
                                  variant="outlined" 
                                  className="card" 
                                  sx={{ position: "relative", cursor: "pointer" }}
                                  onClick={() => handleOpenModal(lesson.lessonVideo || [], lesson._id)}
                                >
                                <CardOverflow>
                                <div className="product-sale">새로운 강의</div>
                                <AspectRatio ratio="1">
                                <img src={imagePath} alt={lesson.lessonName || 'New Lesson'} />
                                </AspectRatio>

                                </CardOverflow>
                                {/* 장바구니 버튼 - 위쪽 */}
                                {!isPurchased(lesson._id) && (
                                  <Box
                                    sx={{
                                      position: "absolute",
                                      top: 10,
                                      right: 10,
                                      zIndex: 1,
                                    }}
                                  >
                                    <Button
                                      variant="solid"
                                      size="sm"
                                      startDecorator={<ShoppingCartIcon />}
                                      onClick={(e) => handleAddToCart(e, lesson)}
                                      sx={{
                                        fontSize: "0.65rem",
                                        padding: "2px 4px",
                                        backgroundColor: "#1976d2",
                                        "&:hover": {
                                          backgroundColor: "#1565c0",
                                        }
                                      }}
                                      className="cart-button"
                                    >
                                      장바구니
                                    </Button>
                                  </Box>
                                )}
                                
                                <CardOverflow variant="soft" className="product-detail" >
                                <Stack className="info" sx={{ position: "relative" }}>
                                <Stack flexDirection={"row"} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography className="title">
                                        {lesson.lessonName || 'Untitled'}
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                      <Divider sx={{ width:'2px', height:"24px", bg: "#d9d9d9"}}/>
                                      <Typography className="price">${lesson.lessonPrice || 0}</Typography>
                                    </Box>
                                </Stack>
                                
                                {/* 구매하기 버튼 - 아래 우측 */}
                                {isPurchased(lesson._id) ? (
                                  <Button
                                    variant="soft"
                                    size="sm"
                                    startDecorator={<CheckCircleIcon />}
                                    disabled
                                    sx={{
                                      position: "absolute",
                                      bottom: 5,
                                      right: 5,
                                      backgroundColor: "rgba(76, 175, 80, 0.2)",
                                      color: "#4caf50",
                                      cursor: "default",
                                      fontSize: "0.65rem",
                                      padding: "2px 4px",
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
                                      bottom: 5,
                                      right: 5,
                                      fontSize: "0.65rem",
                                      padding: "2px 4px",
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

                            </Stack>
                        </CardOverflow>
                    </Card>
                        );
                    })
                      )   : (
<Box className="no-data"> New products are not available! </Box>
                        )}
            
                </CssVarsProvider>
            </Box>
        </Stack>
    </Container>
    
    {/* 동영상 모달 */}
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