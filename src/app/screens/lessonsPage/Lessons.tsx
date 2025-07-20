import React, { useState, useEffect } from "react";
import { Box, Container, Stack, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { CssVarsProvider } from "@mui/joy/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AspectRatio, CardOverflow, Divider, Button as JoyButton } from "@mui/joy";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
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
      const lessonService = new LessonService();
      const data = await lessonService.getLessons({
        page: 1,
        limit: 20, // 더 많은 강의를 가져오기
      });
      setLessons(data);
    } catch (error) {
      console.error("강의 데이터 로딩 실패:", error);
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
      name: lesson.lessonName, // lessonTitle 대신 lessonName 사용
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
        <Container>
          <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
            {/* 왼쪽 필터 패널 */}
            <Box sx={{ minWidth: 220 }}>
              <Box className="category-title" sx={{ mb: 2 }}>
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
                  Price ↑
                </Button>
                <Button
                  variant={priceOrder === "desc" ? "contained" : "outlined"}
                  onClick={() => setPriceOrder("desc")}
                  fullWidth
                >
                  Price ↓
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
            <Stack className="cards-frame" spacing={2} sx={{ flexGrow: 1 }}>
              {loading ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography>강의를 불러오는 중...</Typography>
                </Box>
              ) : filteredLessons.length !== 0 ? (
                <Stack direction="row" flexWrap="wrap" gap={3}>
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
                            {/* 장바구니 버튼 또는 구매 완료 표시 */}
                            <Box
                              sx={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                                zIndex: 1,
                              }}
                            >
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
                                    "&:hover": {
                                      backgroundColor: "rgba(76, 175, 80, 0.2)",
                                    }
                                  }}
                                  className="purchased-button"
                                >
                                  구매완료
                                </JoyButton>
                              ) : (
                                <JoyButton
                                  variant="solid"
                                  size="sm"
                                  startDecorator={<ShoppingCartIcon />}
                                  onClick={(e) => handleAddToCart(e, lesson)}
                                  className="cart-button"
                                >
                                  장바구니
                                </JoyButton>
                              )}
                            </Box>
                          </CardOverflow>

                          <CardContent>
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
                              <Typography
                                level="body-xs"
                                textColor="text.secondary"
                                sx={{ fontWeight: 'md', display: 'flex', alignItems: 'center' }}
                              >
                                {lesson.lessonViews}
                                <VisibilityIcon sx={{ fontSize: 26, ml: 0.5 }} />
                              </Typography>
                            </CardContent>
                          </CardOverflow>
                        </Card>
                      </CssVarsProvider>
                    );
                  })}
                </Stack>
              ) : (
                <Box className="no-data">강의가 없습니다!</Box>
              )}
            </Stack>
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