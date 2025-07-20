import { useState, useEffect } from 'react';

export const usePurchasedLessons = () => {
  const [purchasedLessonIds, setPurchasedLessonIds] = useState<string[]>([]);

  useEffect(() => {
    const checkPurchasedLessons = () => {
      const finishedOrders = localStorage.getItem('finishedOrders');
      if (finishedOrders) {
        const orders = JSON.parse(finishedOrders);
        const purchasedIds = orders.map((order: any) => order._id);
        setPurchasedLessonIds(purchasedIds);
      }
    };

    checkPurchasedLessons();

    // localStorage 변경 감지
    const handleStorageChange = () => {
      checkPurchasedLessons();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // 페이지 내에서 localStorage 변경 감지
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      originalSetItem.apply(this, [key, value]);
      if (key === 'finishedOrders') {
        checkPurchasedLessons();
      }
    };

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  const isPurchased = (lessonId: string) => {
    return purchasedLessonIds.includes(lessonId);
  };

  return { purchasedLessonIds, isPurchased };
}; 