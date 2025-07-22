import React, { useState, useEffect } from "react";
import { Box, Container, Stack, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { CssVarsProvider } from "@mui/joy/styles";

import { AspectRatio, CardOverflow, Divider, Button as JoyButton } from "@mui/joy";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Add this import for a money icon

import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { retriverPopularLessons } from "../homePage/selector.ts";
import { Lesson } from "../../../lib/types/lesson.ts";
import { CartItem } from "../../../lib/types/search.ts";
import { serverApi } from "../../../lib/types/config.ts";
import { LessonCollection } from "../../../lib/enums/lesson.enum.ts";

import VideoModalLP from "./VideoModelLP.tsx";
import { sweetTopSuccessAlert } from "../../../lib/sweetAlert.ts";
import useBasket from "../../../hooks/useBasket.ts";
import { usePurchasedLessons } from "../../../hooks/usePurchasedLessons.ts";
import LessonService from "../../service/LessonService.ts";

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
  const dispatch = useDispatch();

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);

  const [priceOrder, setPriceOrder] = useState<"asc" | "desc" | null>(null);
  const [filterCollection, setFilterCollection] = useState<LessonCollection | "ALL">("ALL");

  // 강의 데이터를 로드하는 함수
  const loadLessons = async () => {
    setLoading(true);
    try {
      console.log("🔄 강의 데이터 로딩 시작...");
      const lessonService = new LessonService();
      const data = await lessonService.getLessons({
        page: 1,
        limit: 20, // 더 많은 강의를 가져오기
      });
      
      console.log("📚 받은 강의 데이터:", data);
      console.log("📊 강의 개수:", data?.length || 0);
      
      if (data && Array.isArray(data)) {
        setLessons(data);
        if (data.length === 0) {
          console.log("⚠️ 강의 데이터가 비어있습니다");
        }
      } else {
        console.error("❌ 올바르지 않은 데이터 형식:", data);
        setLessons([]);
      }
    } catch (error) {
      console.error("❌ 강의 데이터 로딩 실패:", error);
      console.error("에러 세부사항:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트가 마운트될 때마다 강의 데이터 로드
  useEffect(() => {
    loadLessons();
  }, []);

  const handleOpenModal = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedLesson(null);
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
    e.stopPropagation(); // 카드 클릭 방지
    
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

  // Filter + sort qilingan list
  const filteredLessons = lessons
    .filter((lesson) =>
      filterCollection === "ALL" ? true : lesson.lessonCollection === filterCollection
    )
    .sort((a, b) => {
      if (!priceOrder) return 0;
      if (priceOrder === "asc") return a.lessonPrice - b.lessonPrice;
      return b.lessonPrice - a.lessonPrice;
    });

    return (
      <div className="popular-dishes-frame">
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
            {/* 왼쪽 필터 패널 */}
            <Box className="lessons-filter-panel">
              <Box className="category-title">
                Popular Lessons
              </Box>

              <Stack spacing={2}>
                {/* Lesson Collection Filter */}
                <FormControl fullWidth>
                  <InputLabel id="lesson-collection-select-label">Collection</InputLabel>
                  <Select
                    labelId="lesson-collection-select-label"
                    value={filterCollection}
                    label="Collection"
                    onChange={(e) => setFilterCollection(e.target.value as LessonCollection | "ALL")}
                  >
                    <MenuItem value="ALL">All</MenuItem>
                    {Object.values(LessonCollection).map((col) => (
                      <MenuItem key={col} value={col}>
                        {col}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
            
                <Button
                  variant={priceOrder === "asc" ? "contained" : "outlined"}
                  onClick={() => setPriceOrder("asc")}
                  fullWidth
                >
                  Price ↓
                </Button>
                <Button
                  variant={priceOrder === "desc" ? "contained" : "outlined"}
                  onClick={() => setPriceOrder("desc")}
                  fullWidth
                >
                  Price ↑
                </Button>
                <Button
                  variant={!priceOrder ? "contained" : "outlined"}
                  onClick={() => setPriceOrder(null)}
                  fullWidth
                >
                  No Price Sort
                </Button>
                
                {/* 다시 시작하기 버튼 */}
                <Button
                  variant="outlined"
                  onClick={loadLessons}
                  fullWidth
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? "로딩 중..." : "다시 시작하기"}
                </Button>
              </Stack>
            </Box>

            {/* 오른쪽 강의 목록 */}
            <Box className="lessons-cards-container">
              {loading ? (
                <Box className="lessons-loading">
                  <Typography>강의를 불러오는 중...</Typography>
                </Box>
              ) : filteredLessons.length !== 0 ? (
                <Box className="lessons-cards-frame">
                  {filteredLessons.map((lesson: Lesson) => {
                    const imagePath = lesson.lessonImages?.[0]
                      ? `${serverApi}/${lesson.lessonImages[0]}`
                      : "/default.jpg";

                    return (
                      <CssVarsProvider key={lesson._id}>
                        <Card
                          variant="outlined"
                          sx={{ width: 320, cursor: "pointer", position: "relative" }}
                          onClick={() => handleOpenModal(lesson)}
                        >
                          <CardOverflow>
                            <AspectRatio ratio="1">
                              <img
                                src={imagePath}
                                loading="lazy"
                                alt={lesson.lessonTitle}
                              />
                            </AspectRatio>

                          </CardOverflow>

                          <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <Box>
                              <Typography
                                sx={{
                                  fontWeight: 'bold',
                                  color: 'black',
                                  fontSize: '1.3rem',
                                  mb: 0.5
                                }}
                              >
                                ${lesson.lessonPrice}
                              </Typography>
                              <Typography level="title-md">{lesson.lessonTitle}</Typography>
                              <Typography level="body-xs" sx={{ mt: 0.5 }}>
                                {lesson.lessonName} Lessons
                              </Typography>
                            </Box>
                            
                            {/* 버튼들을 가격 반대편에 배치 */}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                              {isPurchased(lesson._id) ? (
                                <JoyButton
                                  variant="soft"
                                  size="sm"
                                  startDecorator={<CheckCircleIcon />}
                                  disabled
                                  sx={{
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
                                </JoyButton>
                              ) : (
                                <>
                                  <JoyButton
                                    variant="solid"
                                    size="sm"
                                    startDecorator={<LocalMallIcon />}
                                    onClick={(e) => handleDirectPurchase(e, lesson)}
                                    sx={{
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
                                  </JoyButton>
                                  <JoyButton
                                    variant="solid"
                                    size="sm"
                                    startDecorator={<ShoppingCartIcon />}
                                    onClick={(e) => handleAddToCart(e, lesson)}
                                    sx={{
                                      fontSize: "0.7rem",
                                      padding: "3px 6px",
                                      backgroundColor: "#1976d2",
                                      "&:hover": {
                                        backgroundColor: "#1565c0",
                                      }
                                    }}
                                    className="cart-button"
                                  >
                                    장바구니
                                  </JoyButton>
                                </>
                              )}
                            </Box>
                          </CardContent>

                          <CardOverflow variant="soft" sx={{ bgcolor: 'background.level2' }}>
                            <Divider inset="context" />
                            <CardContent orientation="horizontal" sx={{ gap: 1.5 }}>
                              <Divider orientation="vertical" />
                              <Typography
                                level="body-xs"
                                textColor="text.secondary"
                                sx={{ fontWeight: 'md', display: 'flex', alignItems: 'center' }}
                              >
                                <DescriptionOutlinedIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                {lesson.lessonDesc
                                  ? lesson.lessonDesc.slice(0, 30) + "..."
                                  : lesson.lessonDesc}
                              </Typography>

                            </CardContent>
                          </CardOverflow>
                        </Card>
                      </CssVarsProvider>
                    );
                  })}
                </Box>
              ) : (
                <Box className="lessons-no-data" sx={{ 
                  textAlign: 'center', 
                  padding: 4,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 2,
                  margin: 2
                }}>
                  <Typography level="h2" sx={{ mb: 2 }}>
                    😔 강의를 찾을 수 없습니다
                  </Typography>
                  <Typography level="body-md" sx={{ mb: 3, color: 'text.secondary' }}>
                    현재 등록된 강의가 없거나 백엔드 서버에서 데이터를 가져올 수 없습니다.
                  </Typography>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button 
                      variant="contained" 
                      onClick={loadLessons}
                      disabled={loading}
                    >
                      다시 시도하기
                    </Button>
                    <Button 
                      variant="outlined"
                      onClick={() => window.location.href = '/'}
                    >
                      홈으로 돌아가기
                    </Button>
                  </Stack>
                  <Typography level="body-xs" sx={{ mt: 2, display: 'block', color: 'text.secondary' }}>
                    문제가 지속되면 브라우저 콘솔(F12)에서 에러 메시지를 확인하세요.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Container>

        {/* 비디오 모달 */}
        {selectedLesson && (
          <VideoModalLP
            open={modalOpen}
            onClose={handleCloseModal}
            videoLinks={selectedLesson.lessonVideo}
            lessonDesc={selectedLesson.lessonDesc ?? ""}
            lessonId={selectedLesson._id}
          />
        )}
      </div>
    );
}