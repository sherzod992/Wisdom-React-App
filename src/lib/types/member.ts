
import { MemberStatus, MemberType } from "../enums/member.enum";

export interface Member{
    _id: string;
    memberType: MemberType;
    memberStatus: MemberStatus;
    memberNick: string;
    memberPhone:string; 
    memberPassword?:string;
    memberAddress?:string;
    memberDesk?:string;
    memberImage?:string;
    memberPoints:number;
    createdAt:Date;
    updatedAt:Date;
}

export interface MemberInput{
    memberType?: MemberType;
    memberStatus?: MemberStatus;
    memberNick: string;
    memberPhone:string;
    memberPassword:string;
    memberAddress?:string;
    memberDesk?:string;
    memberImage?:string;
    memberPoints?:number;
}

export interface LoginInput{
    memberNick:string;
    memberPassword:string;
}

export interface MemberUpdateInput{
    _id: string;
    memberStatus?: MemberStatus;
    memberNick?: string;
    memberPhone?:string;
    memberPassword?:string;
    memberAddress?:string;
    memberDesk?:string;
    memberImage?:string;
}

/**Lesson ts */
