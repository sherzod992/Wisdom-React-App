import React, { ReactNode, useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { Member } from "../../lib/types/member";
import { GlobalContext } from "../../hooks/useGlobals.ts";

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const cookies = new Cookies();

  if (!cookies.get("accessToken")) {
    localStorage.removeItem("memberData");
  }

  const [authMember, setAuthMember] = useState<Member | null>(() => {
    try {
      const memberData = localStorage.getItem("memberData");
      if (memberData && memberData !== "undefined" && memberData !== "null") {
        return JSON.parse(memberData);
      }
      return null;
    } catch (error) {
      console.error("Error parsing memberData from localStorage:", error);
      localStorage.removeItem("memberData");
      return null;
    }
  });

  // localStorage 변경사항을 실시간으로 감지
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const memberData = localStorage.getItem("memberData");
        console.log("Storage change detected, memberData:", memberData);
        
        if (memberData && memberData !== "undefined" && memberData !== "null") {
          const member = JSON.parse(memberData);
          console.log("Updating authMember from storage:", member);
          setAuthMember(member);
        } else {
          console.log("No valid memberData found, but not setting to null automatically");
          // 의도적인 로그아웃이 아닌 경우 상태를 유지
          // setAuthMember(null);
        }
      } catch (error) {
        console.error("Error parsing memberData in handleStorageChange:", error);
        localStorage.removeItem("memberData");
        setAuthMember(null);
      }
    };

    // 다른 탭/창에서의 localStorage 변경 감지
    window.addEventListener('storage', handleStorageChange);

    // 같은 페이지 내에서의 localStorage 변경 감지
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key: string, value: string) {
      originalSetItem.apply(this, [key, value]);
      if (key === 'memberData') {
        handleStorageChange();
      }
    };

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  // setAuthMember를 개선하여 localStorage와 동기화
  const updateAuthMember = (member: Member | null) => {
    setAuthMember(member);
    try {
      if (member && typeof member === 'object') {
        localStorage.setItem("memberData", JSON.stringify(member));
      } else {
        localStorage.removeItem("memberData");
      }
    } catch (error) {
      console.error("Error saving memberData to localStorage:", error);
      localStorage.removeItem("memberData");
    }
  };

  return (
    <GlobalContext.Provider value={{ authMember, setAuthMember: updateAuthMember }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextProvider;
