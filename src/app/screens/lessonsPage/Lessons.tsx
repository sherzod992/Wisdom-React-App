import React, { useState } from "react";
import { Box, Container, Stack, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material"; // Import Select, MenuItem, FormControl, InputLabel
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { CssVarsProvider } from "@mui/joy/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { CardOverflow } from "@mui/joy";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { retriverPopularLessons } from "../homePage/selector.ts";
import { Lesson } from "../../../lib/types/lesson.ts";
import { serverApi } from "../../../lib/types/config.ts";
import { LessonCollection } from "../../../lib/enums/lesson.enum.ts";

import VideoModalLP from "./VideoModelLP.tsx";

// Redux selector
const popularLessonsRetriever = createSelector(
  retriverPopularLessons,
  (popularLessons) => ({ popularLessons })
);

export default function PopularLessons() {
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
                                {/* Price Sort Buttons (vertical) */}
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
    
            {/* O‘ngdagi video kartalar qismi */}
            
            <Stack className="cards-frame" spacing={2} sx={{ flexGrow: 1 }}>
              {filteredLessons.length !== 0 ? (
                filteredLessons.map((lesson: Lesson) => {
                  const imagePath = lesson.lessonImages?.[0]
                    ? `${serverApi}/${lesson.lessonImages[0]}`
                    : "/default.jpg";
    
                  return (
                    <CssVarsProvider key={lesson._id}>
                      <Card
                        className="card"
                        onClick={() => handleOpenModal(lesson)}
                        sx={{ cursor: "pointer" }}
                        variant="outlined"
                      >
                        <CardCover>
                          <img src={imagePath} alt={lesson.lessonDesc} />
                        </CardCover>
    
                        <CardCover className="card-cover" />
    
                        <CardContent sx={{ justifyContent: "flex-end" }}>
                          <Stack flexDirection={"row"} justifyContent={"space-between"}>
                            <Typography level="h2" textColor="#fff" fontSize={"lg"} mb={1}>
                              {lesson.lessonTitle}
                            </Typography>
                            <Typography
                              sx={{
                                fontWeight: "md",
                                color: "neutral.300",
                                alignItems: "center",
                                display: "flex",
                              }}
                            >
                              {lesson.lessonViews}
                              <VisibilityIcon sx={{ fontSize: 25, marginLeft: "5px" }} />
                            </Typography>
                          </Stack>
                        </CardContent>
    
                        <CardOverflow
                          sx={{
                            display: "flex",
                            gap: 1.5,
                            py: 1.5,
                            px: "var(--Card-padding)",
                            borderTop: "1px solid",
                            height: "60px",
                          }}
                        >
                          <Typography
                            startDecorator={<DescriptionOutlinedIcon />}
                            textColor={"neutral.300"}
                          >
                            {lesson.lessonDesc}
                          </Typography>
                        </CardOverflow>
                      </Card>
                    </CssVarsProvider>
                  );
                })
              ) : (
                <Box className="no-data">Popular lessons are not available!</Box>
              )}
            </Stack>
          </Box>
        </Container>
    
        {/* Video Modal */}
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
}