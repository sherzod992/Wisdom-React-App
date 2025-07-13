
import { ViewGroup } from "../enums/lesson.enum";

export interface View {
  _id: string;
  viewGroup: ViewGroup;
  memberId: string;
  viewRefId: string;
  createdAt: Date;
  updateAt: Date;
}

export interface ViewInput {  
  memberId: string;
  viewRefId:string;
  viewGroup: ViewGroup;
}