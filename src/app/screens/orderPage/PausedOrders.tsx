import React from "react";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Button, Stack } from "@mui/material";
import { CartItem } from "../../../lib/types/search.ts";
import { serverApi } from "../../../lib/types/config.ts";
import { sweetTopSuccessAlert, sweetErrorHandling } from "../../../lib/sweetAlert.ts";

interface OrderItem extends CartItem {
  orderId?: string;
  status: 'paused' | 'finished';
  orderDate: Date;
}

interface PausedOrdersProps {
  orders: OrderItem[];
  onPayment: (orderItems: OrderItem[]) => void;
  onCancel: (orderItems: OrderItem[]) => void;
}

export default function PausedOrders({ orders, onPayment, onCancel }: PausedOrdersProps) {
    
    // 주문들을 orderId로 그룹핑
    const groupedOrders = orders.reduce((acc, order) => {
        const orderId = order.orderId || 'default';
        if (!acc[orderId]) {
            acc[orderId] = [];
        }
        acc[orderId].push(order);
        return acc;
    }, {} as Record<string, OrderItem[]>);

    const handlePayment = async (orderItems: OrderItem[]) => {
        try {
            onPayment(orderItems);
            await sweetTopSuccessAlert("결제가 완료되었습니다!", 2000);
        } catch (error) {
            sweetErrorHandling(error);
        }
    };

    const handleCancel = async (orderItems: OrderItem[]) => {
        try {
            onCancel(orderItems);
            await sweetTopSuccessAlert("주문이 취소되었습니다.", 2000);
        } catch (error) {
            sweetErrorHandling(error);
        }
    };

    return (
        <TabPanel value={"1"}>
            <Stack>
                {Object.keys(groupedOrders).length > 0 ? (
                    Object.entries(groupedOrders).map(([orderId, orderItems]) => {
                        const totalPrice = orderItems.reduce((sum, item) => sum + item.price, 0);
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
                                    <Button 
                                        variant="contained" 
                                        color="secondary" 
                                        className={"cancel-button"}
                                        onClick={() => handleCancel(orderItems)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        className={"pay-button"}
                                        onClick={() => handlePayment(orderItems)}
                                    >
                                        Payment
                                    </Button>
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