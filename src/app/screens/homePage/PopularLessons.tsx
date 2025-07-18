import React, { useState } from "react";
import {
  Box,
  Container,
  Stack,
  Divider
} from "@mui/material";
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
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { retriverPopularLessons } from "./selector.ts";
import { Lesson } from "../../../lib/types/lesson.ts";
import { serverApi } from "../../../lib/types/config.ts";
import VideoModal from "./VideoModal.tsx";

// Redux selector
const popularLessonsRetriever = createSelector(
  retriverPopularLessons,
  (popularLessons) => ({ popularLessons })
);

export default function PopularLessons() {
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

  return (
    <div className="popular-dishes-frame">
      <Container>
        <Stack className="popular-section">
          <Box className="category-title">Popular Lessons</Box>

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
                      sx={{ width: 320, cursor: "pointer" }}
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