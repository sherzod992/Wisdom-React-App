
import { OrderStatus } from "../enums/order.enum";
import { Lesson } from "./lesson"; // darslik interfeysi

// Har bir buyurtmadagi dars (lesson) itemi
export interface OrderItem {
  _id: string;
  itemQuantity: number; // Odatda 1, lekin tizim umumiy bo‘lsa qoladi
  itemPrice: number;
  orderId: string;
  lessonId: string; // <-- productId o‘rniga
  createdAt: Date;
  updatedAt: Date;
}

// Order modeli (bitta student tomonidan yaratilgan)
export interface Order {
  toObject(): Order;
  _id: string;
  orderTotal: number;
  orderDelivery: number; // 0 bo‘ladi, chunki darslar online
  orderStatus: OrderStatus;
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
  /** from aggregations **/
  orderItems: OrderItem[];
  lessonData: Lesson[]; // <-- productData o‘rniga
}

// Order yaratishda foydalaniladigan input
export interface OrderItemInput {
  itemQuantity: number;
  itemPrice: number;
  lessonId: string; // <-- productId o‘rniga
  orderId?: string;
  reduce(
    callback: (accumulator: number, item: OrderItemInput) => number,
    initialValue: number
  ): number;
}

// Orderlarni filtrlash uchun
export interface OrderInquiry {
  page: number;
  limit: number;
  orderStatus: OrderStatus;
}

// Orderni yangilash uchun input
export interface OrderUpdateInput {
  orderId: string;
  orderStatus: OrderStatus;
}
