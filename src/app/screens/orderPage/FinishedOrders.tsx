import React from "react";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Stack } from "@mui/material";
import { CartItem } from "../../../lib/types/search.ts";
import { serverApi } from "../../../lib/types/config.ts";

interface OrderItem extends CartItem {
  orderId?: string;
  status: 'paused' | 'finished';
  orderDate: Date;
}

interface FinishedOrdersProps {
  orders: OrderItem[];
}

export default function FinishedOrders({ orders }: FinishedOrdersProps) {
    
    // 주문들을 orderId로 그룹핑
    const groupedOrders = orders.reduce((acc, order) => {
        const orderId = order.orderId || 'default';
        if (!acc[orderId]) {
            acc[orderId] = [];
        }
        acc[orderId].push(order);
        return acc;
    }, {} as Record<string, OrderItem[]>);

    return (
        <TabPanel value={"3"}>
            <Stack>
                {Object.keys(groupedOrders).length > 0 ? (
                    Object.entries(groupedOrders).map(([orderId, orderItems]) => {
                        const totalPrice = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                        const deliveryCost = 0; // 온라인 강의는 배송비 없음
                        const finalTotal = totalPrice + deliveryCost;

                        return (
                            <Box key={orderId} className={"order-main-box"}>
                                <Box className={"order-box-scroll"}>
                                    {orderItems.map((item) => {
                                        const imagePath = item.image 
                                            ? `${serverApi}/${item.image}` 
                                            : "/img/default.jpg";

                                        return (
                                            <Box key={item._id} className={"orders-name-price"}>
                                                <img src={imagePath} className={"orders-dish-img"} alt={item.name} />
                                                <p className={"title-dish"}>{item.name}</p>
                                                <Box className={"price-box"}>
                                                    <p>${item.price}</p>
                                                    <img src={"/icons/close.svg"} alt="" />
                                                    <p>{item.quantity}</p>
                                                    <img src={"/icons/pause.svg"} alt="" />
                                                    <p style={{ marginLeft: "15px" }}>${(item.price * item.quantity).toFixed(2)}</p>
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Box>

                                <Box className={"total-price-box"}>
                                    <Box className={"box-total"}>
                                        <p>Product price</p>
                                        <p>${totalPrice.toFixed(2)}</p>
                                        <img src={"/icons/plus.svg"} style={{ marginLeft: "20px" }} alt="" />
                                        <p>Delivery cost</p>
                                        <p>${deliveryCost}</p>
                                        <img src={"/icons/pause.svg"} style={{ marginLeft: "20px" }} alt="" />
                                        <p>Total</p>
                                        <p>${finalTotal.toFixed(2)}</p>
                                    </Box>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        color: 'green', 
                                        fontWeight: 'bold',
                                        mt: 2 
                                    }}>
                                        ✅ 결제 완료
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })
                ) : (
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
                        <img src={"/icons/noimage-list.svg"} style={{ width: 300, height: 300 }} alt="" />
                    </Box>
                )}
            </Stack>
        </TabPanel>
    );
}