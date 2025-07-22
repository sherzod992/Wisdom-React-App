import axios, { AxiosInstance } from "axios";
import { serverApi } from "../../lib/types/config.ts";
import { Order, OrderItemInput } from "../../lib/types/order.ts";

class OrderService {
  private readonly path: string;
  private readonly api: AxiosInstance;

  constructor() {
    this.path = serverApi;
    
    // axios 인스턴스 생성 및 기본 설정
    this.api = axios.create({
      baseURL: this.path,
      withCredentials: true,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // 요청 인터셉터
    this.api.interceptors.request.use(
      (config) => {
        console.log(`🚀 API 요청: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error("❌ 요청 오류:", error);
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터
    this.api.interceptors.response.use(
      (response) => {
        console.log(`✅ API 응답: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(`❌ API 오류: ${error.response?.status} ${error.config?.url}`, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  public async createOrder(orderItems: OrderItemInput[]): Promise<Order> {
    try {
      const url = `/order/create`;
      console.log("Creating order with items:", orderItems);
      
      const result = await this.api.post(url, { orderItems });
      console.log("createOrder response:", result.data);
      return result.data;
    } catch (err) {
      console.error("createOrder Error:", err);
      throw err;
    }
  }

  public async getMyOrders(): Promise<Order[]> {
    try {
      const url = `/order/all`;
      const result = await this.api.get(url);
      console.log("getMyOrders response:", result.data);
      return result.data;
    } catch (err) {
      console.error("getMyOrders Error:", err);
      throw err;
    }
  }

  public async updateOrder(orderId: string, orderData: Partial<Order>): Promise<Order> {
    try {
      const url = `/order/update`;
      console.log("Updating order:", orderId, orderData);
      
      const result = await this.api.post(url, { orderId, ...orderData });
      console.log("updateOrder response:", result.data);
      return result.data;
    } catch (err) {
      console.error("updateOrder Error:", err);
      throw err;
    }
  }
}

export default OrderService; 