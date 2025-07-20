import React, { useState } from "react";
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
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Add this import for a money icon

import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { retriverPopularLessons } from "../homePage/selector.ts";
import { Lesson } from "../../../lib/types/lesson.ts";
import { CartItem } from "../../../lib/types/search.ts";
import { serverApi } from "../../../lib/types/config.ts";
import { LessonCollection } from "../../../lib/enums/lesson.enum.ts";

import VideoModalLP from "./VideoModelLP.tsx";
import { sweetTopSuccessAlert } from "../../../lib/sweetAlert.ts";

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

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [priceOrder, setPriceOrder] = useState<"asc" | "desc" | null>(null);
  const [filterCollection, setFilterCollection] = useState<LessonCollection | "ALL">("ALL");

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
    const cartItem: CartItem = {
      _id: lesson._id,
      name: lesson.lessonTitle,
      price: lesson.lessonPrice,
      image: lesson.lessonImages?.[0] || "",
      quantity: 1
    };
    onAdd(cartItem);
    await sweetTopSuccessAlert(`${lesson.lessonTitle}이(가) 장바구니에 추가되었습니다!`, 2000);
  };

  // Filter + sort qilingan list
  const filteredLessons = popularLessons
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
            {/* Chapdagi filtrlar paneli */}
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
              </Stack>
            </Box>

            

            <Stack className="cards-frame" spacing={2} sx={{ flexGrow: 1 }}>
              {filteredLessons.length !== 0 ? (
                filteredLessons.map((lesson: Lesson) => {
                  const imagePath = lesson.lessonImages?.[0]
                    ? `${serverApi}/${lesson.lessonImages[0]}`
                    : "/default.jpg";
                    // onClick={() => handleOpenModal(lesson)}
                    return (
                      <div className="popular-dishes-frame">
                        <Container>
                          <Stack className="popular-section">
                            <Box></Box>
                            <Stack className="cards-frame" direction="row" flexWrap="wrap" gap={3}>
                              {popularLessons.length !== 0 ? (
                                popularLessons.map((lesson: Lesson) => {
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
                                          {/* 장바구니 버튼 */}
                                          <Box
                                            sx={{
                                              position: "absolute",
                                              top: 10,
                                              right: 10,
                                              zIndex: 1,
                                            }}
                                          >
                                            <JoyButton
                                              variant="solid"
                                              size="sm"
                                              startDecorator={<ShoppingCartIcon />}
                                              onClick={(e) => handleAddToCart(e, lesson)}
                                              className="cart-button"
                                            >
                                              장바구니
                                            </JoyButton>
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
                                              {lesson.lessonViews || 99}
                                              <VisibilityIcon sx={{ fontSize: 26, ml: 0.5 }} />
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
                            </Stack>
                          </Stack>
                        </Container>
                  
                        {selectedLesson && (
                            <VideoModalLP
                            open={modalOpen}
                            onClose={handleCloseModal}
                            videoLinks={selectedLesson.lessonVideo}
                          lessonDesc={selectedLesson.lessonDesc ?? ""}
                  />
        )}
                      </div>
                    );
                })
              ) : (
                <Box className="no-data">Popular lessons are not available!</Box>
              )}
            </Stack>
          </Box>
        </Container>

        
      </div>
    );
}