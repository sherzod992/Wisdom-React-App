import React, { useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";

// Sahifalar va komponentlar

import OrdersPage from "./screens/orderPage/index.tsx";
import UsersPage from "./screens/usersPage/index.tsx";
import HomePage from "./screens/homePage/index.tsx";
import HomeNavbar from "./components/headers/HomeNavbar.tsx";
import OtherNavbar from "./components/headers/OtherNavbar.tsx";
import Footer from "./components/footer/index.tsx";
import HelpPage from "./screens/helpPage/intex.tsx";
import AuthenticationModal from "./auth/index.tsx";

// Hook va Context Provider
import useBasket from "../hooks/useBasket.ts";


// CSS
import "../css/navbar.css";
import "../css/footer.css";
import "../css/app.css";
import { T } from "../lib/types/common.ts";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../lib/sweetAlert.ts";
import MemberService from "./service/MemberService.ts";
import { useGlobals } from "../hooks/useGlobals.ts";
import ContextProvider from "./context/ContextProvider.tsx";
import LessonsPage from "./screens/lessonsPage/index.tsx";

function App() {
  const location = useLocation();
  const {setAuthMember} = useGlobals();
  const { cartItems, onAdd, onRemove, onDeleteAll, onDelete } = useBasket();

  const [signupOpen, setSignupOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl]= useState<HTMLElement | null>(null);


  const handleSignupClose = () => setSignupOpen(false);
  const handleLoginClose = () => setLoginOpen(false);

  const handleLogOutClick = (e:T) => {
    setAnchorEl(e.currentTarget);
  };
  const handleCloseLogout = () =>setAnchorEl(null);
  const handleLogoutRequest = async () => {
    try{
      console.log("로그아웃 시작...");
      
      // 먼저 로컬 데이터 정리 (서버 오류와 상관없이 실행)
      setAuthMember(null);
      onDeleteAll();
      localStorage.removeItem('pausedOrders');
      localStorage.removeItem('finishedOrders');
      console.log("로컬 데이터 초기화 완료");
      
      // 서버에 로그아웃 요청 (실패해도 로컬 정리는 이미 완료)
      try {
        const member = new MemberService();
        await member.logout();
        console.log("서버 로그아웃 성공");
      } catch (serverError) {
        console.warn("서버 로그아웃 요청 실패, 하지만 로컬 정리는 완료:", serverError);
      }
      
      await sweetTopSuccessAlert("로그아웃되었습니다", 1000);
      window.location.replace('/');
      
    }catch(error){
      console.error("로그아웃 처리 중 오류:", error);
      // 오류가 있어도 강제로 로그아웃 상태로 만들기
      setAuthMember(null);
      localStorage.clear(); // 모든 로컬 데이터 정리
      sweetErrorHandling(error);
      window.location.replace('/');
    }
  }

  return (
    <ContextProvider>
      {location.pathname === "/" ? (
        <HomeNavbar
          cartItems={cartItems}
          onAdd={onAdd}
          onRemove={onRemove}
          onDelateAll={onDeleteAll}
          onDelate={onDelete}
          setSignupOpen={setSignupOpen}
          setLoginOpen={setLoginOpen}
          anchorEl={anchorEl}
          handleLogOutClick={handleLogOutClick}
          handleCloseLogout={handleCloseLogout}
          handleLogoutRequest={handleLogoutRequest}
        />
      ) : (
        <OtherNavbar
          cartItems={cartItems}
          onAdd={onAdd}
          onRemove={onRemove}
          onDelateAll={onDeleteAll}
          onDelate={onDelete}
          setSignupOpen={setSignupOpen}
          setLoginOpen={setLoginOpen}
          anchorEl={anchorEl}
          handleLogOutClick={handleLogOutClick}
          handleCloseLogout={handleCloseLogout}
          handleLogoutRequest={handleLogoutRequest}
        />
      )}

      <Switch>
        <Route path="/lessons">
          <LessonsPage onAdd={onAdd}/>
          {/* onAdd={onAdd} */}
        </Route>
        <Route path="/orders">
          <OrdersPage />
        </Route>
        <Route path="/member-page">
          <UsersPage />
        </Route>
        <Route path="/help">
          <HelpPage />
        </Route>
        <Route path="/" exact>
          <HomePage onAdd={onAdd} />
        </Route>
      </Switch>

      <Footer />
      <AuthenticationModal
        signupOpen={signupOpen}
        loginOpen={loginOpen}
        handleLoginClose={handleLoginClose}
        handleSignupClose={handleSignupClose}
      />
    </ContextProvider>
  );
}

export default App;

