import React, { useState } from "react";
import VideoModalLP from "./VideoModelLP"; // Video modal komponentingiz

interface Lesson {
  lessonVideo: string[]; // YouTube video linklari
  lessonDesc: string;
  // boshqa kerakli maydonlar
}

interface LessonDetailProps {
  lesson: Lesson;
}

export default function LessonDetail({ lesson }: LessonDetailProps) {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setVideoModalOpen(true)}>Watch Videos</button>

      <VideoModalLP
        open={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoLinks={lesson.lessonVideo}
        lessonDesc={lesson.lessonDesc}
      />
    </>
  );
}
