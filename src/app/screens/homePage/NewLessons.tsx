import React from "react";

import { Box, Container, Stack } from "@mui/material";
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import {CssVarsProvider} from "@mui/joy/styles"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { AspectRatio, CardOverflow, Divider } from "@mui/joy";



import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { retriverNewLessons } from "./selector.ts";
import { Lesson } from "../../../lib/types/lesson.ts";
import { serverApi } from "../../../lib/types/config.ts";

const newLessonsRetriever = createSelector (
    retriverNewLessons, 
    (newLessons)=>({newLessons}));


export default function NewLessons() {
    const {newLessons}= useSelector(newLessonsRetriever)
return (
    <div className="new-products-frame">
    <Container>
        <Stack className="main">
            <Box className = "category-title">New Lessons</Box>
            <Stack className="cards-frame">
                <CssVarsProvider>
                    {newLessons.length !== 0 ? (

                        newLessons.map((lesson:Lesson) => {
                            const imagePath =
                            lesson.lessonImages?.[0]
                              ? `${serverApi}/${lesson.lessonImages[0]}`
                              : "/default.jpg"; // fallback image  
                                      
                            return(
                                <Card key={lesson._id} variant="outlined" className = "card">
                                <CardOverflow>
                                <div className="product-sale">Normal Size</div>
                                <AspectRatio ratio="1">
                                <img src={imagePath} alt="" />
                                </AspectRatio>
                                </CardOverflow>
                                <CardOverflow variant="soft" className = "product-detail" >
                                <Stack className="info">
                                <Stack flexDirection={"row"}>
                                    <Typography className = "title">
                                        {lesson.lessonName}
                                    </Typography>
                                    <Divider sx={{ width:'2px', height:"24px", bg: "#d9d9d9"}}/>
                                    <Typography className = {"price"}>{lesson.lessonPrice}</Typography>
                                </Stack>
                                <Stack>
                                    <Typography className = "views">
                                        {lesson.lessonViews}
                                        <VisibilityIcon sx={{fontSize:20, marginLeft : "5px"}}/>
                                    </Typography>
                                </Stack>
                            </Stack>
                        </CardOverflow>
                    </Card>
                        );
                    })
                      )   : (
<Box className = "no-data"> New products are not available! </Box>
                        )}
            
                </CssVarsProvider>
            </Stack>
        </Stack>
    </Container>
</div>
);
}