import React from "react";
import { Box, Button, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import CancelIcon from "@mui/icons-material/Cancel";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search.ts";
import { serverApi } from "../../../lib/types/config.ts";

interface BasketProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDeleteAll: () => void;
  onDelate: (item: CartItem) => void; // 'onDelate' 추가
}

export default function Basket({
  cartItems,
  onAdd,
  onRemove,
  onDelate,
  onDeleteAll,
}: BasketProps) {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const shippingCost = itemsPrice < 100 ? 5 : 0;
  const totalPrice = (itemsPrice + shippingCost).toFixed(2);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box className="hover-line">
      <IconButton
        aria-label="cart"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Badge badgeContent={cartItems.length} color="secondary">
          <img src="/icons/shopping-cart.svg" alt="cart" />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Stack className="basket-frame">
          <Box className="all-check-box">
            {cartItems.length === 0 ? (
              <div>Cart is empty</div>
            ) : (
              <Stack direction="row" alignItems="center">
                <div>Cart Products</div>
                <DeleteForeverIcon
                  sx={{ ml: 1, cursor: "pointer" }}
                  color="primary"
                  onClick={onDeleteAll}
                />
              </Stack>
            )}
          </Box>

          <Box className="orders-main-wrapper">
            <Box className="orders-wrapper">
              {cartItems.map((item) => {
                const imagePath = `${serverApi}/${item.image}`;
                return (
                  <Box key={item._id} className="basket-info-box">
                    <div className="cancel-btn">
                      <CancelIcon
                        onClick={() => onDelate(item)}
                        color="primary"
                      />
                    </div>
                    <img src={imagePath} className="product-img" alt={item.name} />
                    <span className="product-name">{item.name}</span>
                    <p className="product-price">
                      ${item.price} × {item.quantity}
                    </p>
                    <Box sx={{ minWidth: 120 }}>
                      <div className="col-2">
                        <button className="remove" onClick={() => onRemove(item)}>
                          –
                        </button>
                        <button className="add" onClick={() => onAdd(item)}>
                          +
                        </button>
                      </div>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {cartItems.length > 0 && (
            <Box className="basket-order">
              <span className="price">
                Total: ${totalPrice} (${itemsPrice} + ${shippingCost})
              </span>
              <Button
                startIcon={<ShoppingCartIcon />}
                variant="contained"
                onClick={() => history.push("/orders")}
              >
                Order
              </Button>
            </Box>
          )}
        </Stack>
      </Menu>
    </Box>
  );
}
