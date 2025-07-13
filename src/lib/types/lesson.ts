import { LessonCollection, LessonStatus } from "../enums/lesson.enum";

export interface Lesson {
    _id: string;
    lessonStatus: LessonStatus;
    lessonTitle: string;
    lessonPrice: number;
    lessonDesc?: string;
    lessonVideo: string[];
    lessonImage:string[];
    lessonViews: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface LessonInquiry {
    order?: string;
    page: number;
    limit: number;
    lessonCollection?:LessonCollection
    search?: string;
  }
  export interface LessonInput {
    _id:string;
    lessonTitle?: string;
    lessonDesc?: string;
    lessonVideo?: string[]; // 선택적 속성
    lessonPrice?: number;
    lessonCollection?: string; // 선택적 속성
    lessonStatus?: string; // 선택적 속성
    lessonImages?: string[]; // 선택적 속성
    lessonViews?: number;
}


export interface LessonUpdateInput {
    orderId: string; 
    lessonStatus?: LessonStatus;
    lessonCollection?:LessonCollection
    lessonTitle?: string;
    lessonPrice?: number;
    lessonDesc?: string;
    lessonVideoLinks?: string[];
    lessonViews?: number;
}
