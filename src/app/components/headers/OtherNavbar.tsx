import React, { use } from "react";
import { Box, Button, Container, ListItemIcon, Menu, MenuItem, Stack } from "@mui/material";
import {NavLink} from "react-router-dom"
import Basket from "./Basket.tsx";
import { CartItem } from "../../../lib/types/search.ts";
import { useGlobals } from "../../../hooks/useGlobals.ts";
import { Logout } from "@mui/icons-material";



interface OtherNavbarPromps{
    cartItems: CartItem[];
    onAdd:(item:CartItem)=>void;
    onRemove:(item:CartItem)=>void;
    onDelate:(item:CartItem)=>void;
    onDelateAll:()=>void;
    setSignupOpen:(isOpen:boolean)=>void;
    setLoginOpen:(isOpen:boolean)=>void;
    handleLogOutClick:(e:React.MouseEvent<HTMLElement>)=>void;
    anchorEl:HTMLElement | null;
    handleCloseLogout:()=>void;
    handleLogoutRequest:()=>void;

}
export default function OtherNavbar(props:OtherNavbarPromps){
    const {cartItems,
        onAdd,
        onRemove,
        onDelate,
        onDelateAll,
        setSignupOpen,
        setLoginOpen,
        handleLogOutClick,
        anchorEl,
        handleCloseLogout,
        handleLogoutRequest
        }=props;
    const {authMember}=useGlobals();
    return (
      <div className="other-navbar">
        <Container className="navbar-container">
            <Stack className="menu">
                <Box>
                    <NavLink to={'/'}> 
                        <img className='brand-logo' src="/icons/burak.svg" />
                    </NavLink>
                </Box>
                <Stack className="links">
                    <Box className={"hover-line"} >
                        <NavLink to={'/'}  >Home</NavLink>
                    </Box>
                    <Box className={"hover-line"}>
                        <NavLink to={'/products'} >Products</NavLink>
                    </Box >
                    {authMember ? (
                        <Box className={"hover-line"}>
                            <NavLink to={'/orders'}>Orders</NavLink>
                        </Box>
                    ) : null}
                    {authMember ? (
                        <Box className={"hover-line"}>
                            <NavLink to={'/member-page'}  >My Page</NavLink>
                        </Box>
                    ) : null}
                    <Box className={"hover-line"}>
                        <NavLink to={'/help'}  >Help</NavLink>
                    </Box>
                    <Basket cartItems={cartItems}onAdd={onAdd} onRemove={onRemove} onDeleteAll={onDelateAll} onDelate={onDelate}
                    />
                    {!authMember ? (
                        <Box>
                            <Button variant="contained" className="login-button" onClick={()=>setLoginOpen(true)}>Login</Button>
                        </Box>
                    ) : (
                        <img className="user-avatar"
                        src={authMember?.memberImage?`${authMember?.memberImage}`:"/icons/default-user.svg"}
                        aria-haspopup = {"true"}
                        onClick={handleLogOutClick} />
                    )} 
                    <Menu
                        anchorEl={anchorEl}
                        open ={Boolean(anchorEl)}
                        id="account-menu"
                        onClose={handleCloseLogout}
                        onClick={handleCloseLogout}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} >
                    <MenuItem onClick={handleLogoutRequest}>
                        <ListItemIcon>
                            <Logout fontSize="small" style={{ color: 'blue' }} />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>

                </Stack>
            </Stack>
        </Container>
    </div>
    )}