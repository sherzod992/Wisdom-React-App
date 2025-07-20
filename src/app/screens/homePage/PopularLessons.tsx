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
import VisibilityIcon from "@mui/icons-material/Visibility";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { retriverPopularLessons } from "./selector.ts";
import { Lesson } from "../../../lib/types/lesson.ts";
import { CartItem } from "../../../lib/types/search.ts";
import { serverApi } from "../../../lib/types/config.ts";
import VideoModal from "./VideoModal.tsx";
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
  const [selectedVideos, setSelectedVideos] = useState<string[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = (lessonVideo: string[]) => {
    setSelectedVideos(lessonVideo);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedVideos(null);
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

  return (
    <div className="popular-dishes-frame">
      <Container>
        <Stack className="popular-section">
          <Box className="category-title">인기가 많은 수업 및 다음에 학습할 것 </Box>
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
                      sx={{ width: 450, cursor: "pointer", position: "relative" }}
                      onClick={() => handleOpenModal(lesson.lessonVideo)}
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
                          <Button
                            variant="solid"
                            size="sm"
                            startDecorator={<ShoppingCartIcon />}
                            onClick={(e) => handleAddToCart(e, lesson)}
                            className="cart-button"
                          >
                            장바구니
                          </Button>
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

      {selectedVideos && (
        <VideoModal open={modalOpen} onClose={handleCloseModal} videoLinks={selectedVideos} />
      )}
    </div>
  );
}