import React from "react";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Stack, Button } from "@mui/material";
import { CartItem } from "../../../lib/types/search.ts";
import { serverApi } from "../../../lib/types/config.ts";
import { sweetTopSuccessAlert, sweetErrorHandling } from "../../../lib/sweetAlert.ts";

interface OrderItem extends CartItem {
  orderId?: string;
  status: 'paused' | 'finished';
  orderDate: Date;
}

interface FinishedOrdersProps {
  orders: OrderItem[];
  onRefund: (orderItems: OrderItem[]) => void;
}

export default function FinishedOrders({ orders, onRefund }: FinishedOrdersProps) {
    
    // 주문들을 orderId로 그룹핑
    const groupedOrders = orders.reduce((acc, order) => {
        const orderId = order.orderId || 'default';
        if (!acc[orderId]) {
            acc[orderId] = [];
        }
        acc[orderId].push(order);
        return acc;
    }, {} as Record<string, OrderItem[]>);

    const handleRefund = async (orderItems: OrderItem[]) => {
        try {
            onRefund(orderItems);
            await sweetTopSuccessAlert("구매가 취소되었습니다. 해당 강의를 다시 구매할 수 있습니다.", 3000);
        } catch (error) {
            sweetErrorHandling(error);
        }
    };

    return (
        <TabPanel value={"2"}>
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
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'space-between', 
                                        mt: 2 
                                    }}>
                                        <Box sx={{ 
                                            color: 'green', 
                                            fontWeight: 'bold'
                                        }}>
                                            ✅ 결제 완료
                                        </Box>
                                        <Button 
                                            variant="outlined" 
                                            color="error" 
                                            size="small"
                                            onClick={() => handleRefund(orderItems)}
                                            sx={{
                                                borderColor: "#FF6B6B",
                                                color: "#FF6B6B",
                                                "&:hover": {
                                                    borderColor: "#FF5252",
                                                    backgroundColor: "rgba(255, 107, 107, 0.04)",
                                                }
                                            }}
                                        >
                                            구매취소
                                        </Button>
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