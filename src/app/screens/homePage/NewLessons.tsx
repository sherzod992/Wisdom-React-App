import React from "react";

import { Container, Stack } from "@mui/material";
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import {CssVarsProvider} from "@mui/joy/styles"
import VisibilityIcon from "@mui/icons-material/Visibility"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AspectRatio, CardOverflow, Divider, Button, Box } from "@mui/joy";



import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { retriverNewLessons } from "./selector.ts";
import { Lesson } from "../../../lib/types/lesson.ts";
import { CartItem } from "../../../lib/types/search.ts";
import { serverApi } from "../../../lib/types/config.ts";
import { sweetTopSuccessAlert } from "../../../lib/sweetAlert.ts";

const newLessonsRetriever = createSelector (
    retriverNewLessons, 
    (newLessons)=>({newLessons}));

interface NewLessonsProps {
  onAdd: (item: CartItem) => void;
}

export default function NewLessons({ onAdd }: NewLessonsProps) {
    const {newLessons}= useSelector(newLessonsRetriever)

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
    <div className="new-products-frame">
    <Container>
        <Stack className="main">
            <Box className = "category-title">새로운 강의</Box>
            <Stack className="cards-frame">
                <CssVarsProvider>
                    {newLessons.length !== 0 ? (

                        newLessons.map((lesson:Lesson) => {
                            const imagePath =
                            lesson.lessonImages?.[0]
                              ? `${serverApi}/${lesson.lessonImages[0]}`
                              : "/default.jpg"; // fallback image  
                                      
                            return(
                                <Card key={lesson._id} variant="outlined" className = "card" sx={{ position: "relative" }}>
                                <CardOverflow>
                                <div className="product-sale">인기 많은 강의</div>
                                <AspectRatio ratio="1">
                                <img src={imagePath} alt="" />
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