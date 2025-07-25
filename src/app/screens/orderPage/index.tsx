import { useState, SyntheticEvent, useEffect } from "react";
import { Container, Stack, Box } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PausedOrders from "./PausedOrders.tsx";
import FinishedOrders from "./FinishedOrders.tsx";
import "../../../css/orders.css"
import React from "react";
import { CartItem } from "../../../lib/types/search.ts";
import useBasket from "../../../hooks/useBasket.ts";
import { useGlobals } from "../../../hooks/useGlobals.ts";
import { serverApi } from "../../../lib/types/config.ts";

interface OrderItem extends CartItem {
  orderId?: string;
  status: 'paused' | 'finished';
  orderDate: Date;
}

export default function OrdersPage() {
  const [value, setValue] = useState("1");
  const { cartItems, onDeleteAll, onDelete } = useBasket();
  const { authMember } = useGlobals();
  
  // 로컬 스토리지에서 주문 데이터 관리
  const [pausedOrders, setPausedOrders] = useState<OrderItem[]>([]);
  const [finishedOrders, setFinishedOrders] = useState<OrderItem[]>([]);

  useEffect(() => {
    // 로컬 스토리지에서 기존 주문 데이터 로드
    const pausedOrdersData = localStorage.getItem('pausedOrders');
    const finishedOrdersData = localStorage.getItem('finishedOrders');
    
    if (pausedOrdersData) {
      setPausedOrders(JSON.parse(pausedOrdersData));
    }
    if (finishedOrdersData) {
      setFinishedOrders(JSON.parse(finishedOrdersData));
    }
  }, []);

  useEffect(() => {
    // 장바구니 아이템들을 paused orders로 추가 (중복 방지)
    if (cartItems.length > 0) {
      const existingPausedIds = pausedOrders.map(order => order._id);
      const newItems = cartItems.filter(item => !existingPausedIds.includes(item._id));
      
      if (newItems.length > 0) {
        // 모든 새 아이템에 같은 orderId 할당 (하나의 주문으로 그룹화)
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newPausedOrders = newItems.map(item => ({
          ...item,
          orderId,
          status: 'paused' as const,
          orderDate: new Date()
        }));
        
        const updatedPausedOrders = [...pausedOrders, ...newPausedOrders];
        setPausedOrders(updatedPausedOrders);
        localStorage.setItem('pausedOrders', JSON.stringify(updatedPausedOrders));
      }
    }
  }, [cartItems]);

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handlePayment = (orderItems: OrderItem[]) => {
    console.log("Starting payment process for items:", orderItems.map(item => item._id));
    console.log("Current cart items before payment:", cartItems.map(item => item._id));
    
    // paused orders에서 finished orders로 이동
    const completedOrders = orderItems.map(item => ({
      ...item,
      status: 'finished' as const,
      orderDate: new Date()
    }));

    // paused orders에서 제거
    const updatedPausedOrders = pausedOrders.filter(
      pausedItem => !orderItems.some(item => item._id === pausedItem._id)
    );

    // finished orders에 추가
    const updatedFinishedOrders = [...finishedOrders, ...completedOrders];

    // 상태 업데이트
    setPausedOrders(updatedPausedOrders);
    setFinishedOrders(updatedFinishedOrders);

    // 로컬 스토리지 업데이트
    localStorage.setItem('pausedOrders', JSON.stringify(updatedPausedOrders));
    localStorage.setItem('finishedOrders', JSON.stringify(updatedFinishedOrders));

    // 장바구니에서 결제한 아이템들 제거
    setTimeout(() => {
      console.log("Removing items from cart...");
      console.log("Cart items before removal:", cartItems.length);
      
      // useBasket 훅을 통해 아이템들을 하나씩 제거
      orderItems.forEach((orderItem, index) => {
        setTimeout(() => {
          const cartItem = cartItems.find(cart => cart._id === orderItem._id);
          if (cartItem) {
            onDelete(cartItem);
            console.log(`Removed from cart [${index + 1}/${orderItems.length}]:`, cartItem._id);
          }
          
          // 마지막 아이템 제거 후 전체 정리
          if (index === orderItems.length - 1) {
            setTimeout(() => {
              if (updatedPausedOrders.length === 0) {
                console.log("All orders completed, clearing entire cart");
                onDeleteAll();
                console.log("Cart completely cleared");
              }
              
              // 최종 상태 확인
              setTimeout(() => {
                const finalCartData = localStorage.getItem('cartData');
                const finalCart = finalCartData ? JSON.parse(finalCartData) : [];
                console.log("Final cart state:", finalCart.length, "items");
              }, 100);
            }, 50);
          }
        }, index * 50); // 각 아이템 제거 사이에 50ms 간격
      });
    }, 200);
  };

  const handleCancelOrder = (orderItems: OrderItem[]) => {
    // paused orders에서 제거
    const updatedPausedOrders = pausedOrders.filter(
      pausedItem => !orderItems.some(item => item._id === pausedItem._id)
    );

    setPausedOrders(updatedPausedOrders);
    localStorage.setItem('pausedOrders', JSON.stringify(updatedPausedOrders));
  };

  const handleRefundOrder = (orderItems: OrderItem[]) => {
    console.log("Starting refund process for items:", orderItems.map(item => item._id));
    
    // finished orders에서 제거 (구매 취소)
    const updatedFinishedOrders = finishedOrders.filter(
      finishedItem => !orderItems.some(item => item._id === finishedItem._id)
    );

    // 상태 업데이트
    setFinishedOrders(updatedFinishedOrders);
    
    // 로컬 스토리지 업데이트
    localStorage.setItem('finishedOrders', JSON.stringify(updatedFinishedOrders));
    
    console.log("Refund completed. Items removed from finished orders.");
  };

  return (
    <div className={"order-page"}>
      <Container className="order-container">
        <Stack className="order-left">
          <TabContext value={value}>
            <Box className={"order-nav-frame"}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  className={"table_list"}
                >
                  <Tab label="PAUSED ORDERS" value={"1"} />
                  <Tab label="FINISHED ORDERS" value={"2"} />
                </Tabs>
              </Box>
            </Box>
            <Stack className={"order-main-content"}>
              <PausedOrders 
                orders={pausedOrders} 
                onPayment={handlePayment}
                onCancel={handleCancelOrder}
              />
              <FinishedOrders 
                orders={finishedOrders} 
                onRefund={handleRefundOrder}
              />
            </Stack>
          </TabContext>
        </Stack>

        
        <Stack className={"order-right"}>
        <Box className={"order-info-box"}>
            <Box className={"member-box"}>
              <div className={"order-user-img"}>
                <img 
                  src={authMember?.memberImage ? 
                    (authMember.memberImage.startsWith('http') ? 
                      authMember.memberImage : 
                      `${serverApi}/${authMember.memberImage}`) : 
                    "/icons/default-user.svg"}
                  className={"order-user-avatar"}
                  alt="User Avatar"
                />
                <div className={"order-user-icon-box"}>
                  <img
                    src={"/icons/user-badge.svg"}
                    className={"order-user-prof-img"}
                    alt=""
                  />
                </div>
              </div>
              <span className={"order-user-name"}>
                {authMember?.memberNick || "Guest"}
              </span>
              <span className={"order-user-prof"}>
                {authMember?.memberStatus || "User"}
              </span>
            </Box>
            <Box className={"liner"}></Box>
            <Box className={"order-user-address"}>
              <div style={{ display: "flex" }}>
                <LocationOnIcon />
              </div>
              <div className={"spec-address-txt"}>
                {authMember?.memberAddress || "주소가 등록되지 않았습니다"}
              </div>
            </Box>
          </Box>
          <Box className={"order-info-box"}>
            <input
              type={"text"}
              name={"cardNumber"}
              placeholder={"Card number : 1231,1235,1234,1234"}
              className={"card-input"}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <input
                type={"text"}
                name={"cardPeriod"}
                placeholder={"07 / 24"}
                className={"card-half-input"}
              />
              <input
                type={"text"}
                name={"cardCVV"}
                placeholder={"CVV : 077"}
                className={"card-half-input"}
              />
            </div>
            <input
              type={"text"}
              name={"cardCreator"}
              placeholder={authMember?.memberNick || "이름을 입력하세요"}
              className={"card-input"}
            />
            <div className={"cards-box"}>
              <img src={"/icons/western-card.svg"} alt="" />
              <img src={"/icons/master-card.svg"} alt="" />
              <img src={"/icons/paypal-card.svg"} alt="" />
              <img src={"/icons/visa-card.svg"} alt="" />
            </div>
          </Box>
        </Stack>
      </Container>
    </div>
  )
}