import { useState } from "react";
import { CartItem } from "../lib/types/search.ts";

const useBasket = () => {
  const cartJson: string | null = localStorage.getItem("cartData");
  const initialCart: CartItem[] = cartJson ? JSON.parse(cartJson) : [];
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);

  const onAdd = (input: CartItem) => {
    const exist = cartItems.find((item) => item._id === input._id);
    
    // 이미 있는 강의는 추가하지 않음 (한 번에 하나씩만 주문)
    if (exist) {
      return; // 이미 장바구니에 있으면 추가하지 않음
    }
    
    const cartUpdate = [...cartItems, { ...input, quantity: 1 }];
    setCartItems(cartUpdate);
    localStorage.setItem("cartData", JSON.stringify(cartUpdate));
  };

  const onRemove = (input: CartItem) => {
    const exist = cartItems.find((item) => item._id === input._id);
    if (!exist) return;

    let cartUpdate: CartItem[];

    if (exist.quantity === 1) {
      cartUpdate = cartItems.filter((item) => item._id !== input._id);
    } else {
      cartUpdate = cartItems.map((item) =>
        item._id === input._id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    }

    setCartItems(cartUpdate);
    localStorage.setItem("cartData", JSON.stringify(cartUpdate));
  };

  const onDelete = (input: CartItem) => {
    const cartUpdate = cartItems.filter((item) => item._id !== input._id);
    setCartItems(cartUpdate);
    localStorage.setItem("cartData", JSON.stringify(cartUpdate));
  };

  const onDeleteAll = () => {
    setCartItems([]);
    localStorage.removeItem("cartData");
  };

  return {
    cartItems,
    onAdd,
    onRemove,
    onDeleteAll,
    onDelete,
  };
};

export default useBasket;
