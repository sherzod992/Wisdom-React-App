import { Box, Stack, Button } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { retriverNewLessons } from "./selector.ts";
import { Lesson } from "../../../lib/types/lesson.ts";
import { serverApi } from "../../../lib/types/config.ts";
import VideoModal from "./VideoModal.tsx";

import LocalMallIcon from "@mui/icons-material/LocalMall";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { CartItem } from "../../../lib/types/search.ts";
import { sweetTopSuccessAlert } from "../../../lib/sweetAlert.ts";

import { usePurchasedLessons } from "../../../hooks/usePurchasedLessons.ts";

SwiperCore.use([Autoplay, Navigation, Pagination]);

const newLessonsRetriever = createSelector(
  retriverNewLessons,
  (newLessons) => ({ newLessons })
);

export default function Events() {
  const { newLessons } = useSelector(newLessonsRetriever);
  const { isPurchased } = usePurchasedLessons();
  const [selectedVideos, setSelectedVideos] = useState<string[] | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 안전한 기본값 설정
  const safeLessons = newLessons || [];

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

  // 이벤트용 강의들 (최대 6개)
  const eventLessons = safeLessons.slice(0, 6);

  return (
    <div className={"events-frame"}>
      <Stack className={"events-main"}>
        <Box className={"events-text"}>
          <span className={"category-title"}>강의 이벤트</span>
        </Box>

        <Swiper
          className={"events-info swiper-wrapper"}
          slidesPerView={"auto"}
          centeredSlides={true}
          spaceBetween={30}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            el: ".swiper-pagination",
            clickable: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: true,
          }}
        >
          {eventLessons.length > 0 ? eventLessons.map((lesson: Lesson, index: number) => {
            const imagePath = lesson.lessonImages?.[0]
              ? `${serverApi}/${lesson.lessonImages[0]}`
              : "/img/default.jpg";

            return (
              <SwiperSlide 
                key={lesson._id} 
                className={"events-info-frame"}
                onClick={() => handleOpenModal(lesson.lessonVideo || [], lesson._id)}
                style={{ cursor: "pointer", position: "relative" }}
              >
                <div className={"events-img"}>
                  <img src={imagePath} className={"events-img"} alt={lesson.lessonName || 'Event Lesson'} />
                  {/* 이벤트 배지 */}
                  <div className="event-badge">
                    {index === 0 ? "🔥 NEW" : "⭐ HOT"}
                  </div>
                  

                </div>
                <Box className={"events-desc"}>
                  <Box className={"events-bott"}>
                    <Box className={"bott-left"}>
                      <div className={"event-title-speaker"}>
                        <strong>{lesson.lessonName || 'Untitled Lesson'}</strong>
                        <div className={"event-organizator"}>
                          <img src={"/icons/speaker.svg"} alt="speaker" />
                          <p className={"spec-text-author"}>Wisdom Academy</p>
                        </div>
                      </div>

                      <p className={"text-desc"}>
                        {lesson.lessonDesc ? lesson.lessonDesc.slice(0, 100) + "..." : "특별 이벤트 강의입니다."}
                      </p>

                      <div className={"bott-info"} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {/* 구매하기 버튼만 남김 */}
                        {isPurchased(lesson._id) ? (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<CheckCircleIcon />}
                            disabled
                            sx={{
                              backgroundColor: "rgba(76, 175, 80, 0.9)",
                              color: "#fff",
                              cursor: "default",
                              fontSize: "0.65rem",
                              padding: "2px 6px",
                              "&:hover": {
                                backgroundColor: "rgba(76, 175, 80, 0.9)",
                              }
                            }}
                          >
                            구매완료
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<LocalMallIcon />}
                            onClick={(e) => handleDirectPurchase(e, lesson)}
                            sx={{
                              backgroundColor: "#FF6B6B",
                              fontSize: "0.6rem",
                              padding: "2px 4px",
                              "&:hover": {
                                backgroundColor: "#FF5252",
                              }
                            }}
                          >
                            구매하기
                          </Button>
                        )}
                        
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                          <div className={"bott-info-main"}>
                            <img src={"/icons/calendar.svg"} alt="calendar" />
                            이벤트 진행중
                          </div>
                          <div className={"bott-info-main"}>
                            <img src={"/icons/dollar.svg"} alt="price" />
                            ${lesson.lessonPrice || 0}
                          </div>
                        </div>
                      </div>
                    </Box>
                  </Box>
                </Box>
              </SwiperSlide>
            );
          }) : (
            <SwiperSlide className={"events-info-frame"}>
              <div className={"events-img"}>
                <img src={"/img/default.jpg"} className={"events-img"} alt="No Events" />
              </div>
              <Box className={"events-desc"}>
                <Box className={"events-bott"}>
                  <Box className={"bott-left"}>
                    <div className={"event-title-speaker"}>
                      <strong>이벤트 준비중</strong>
                    </div>
                    <p className={"text-desc"}>곧 새로운 이벤트가 시작됩니다!</p>
                  </Box>
                </Box>
              </Box>
            </SwiperSlide>
          )}
        </Swiper>
        <Box className={"prev-next-frame"}>
          <img
            src={"/icons/arrow-right.svg"}
            className={"swiper-button-prev"}
            alt="previous"
          />
          <div className={"dot-frame-pagination swiper-pagination"}></div>
          <img
            src={"/icons/arrow-right.svg"}
            className={"swiper-button-next"}
            style={{ transform: "rotate(-180deg)" }}
            alt="next"
          />
        </Box>
      </Stack>

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
