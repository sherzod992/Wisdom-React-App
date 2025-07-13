import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => { // F/P/?/T
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Agar onPerfEntry mavjud va u funksiya bo‘lsa, ichidagi kod ishlaydi
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);

    });
  }
};
// CLS	페이지 로딩 중에 레이아웃이 갑자기 움직이는지
// FID	사용자가 처음 클릭했을 때 반응 속도
// FCP	첫 화면 콘텐츠가 얼마나 빨리 보이는지
// LCP	가장 큰 콘텐츠(이미지나 텍스트)가 얼마나 빨리 뜨는지
// TTFB	서버에서 첫 번째 응답이 얼마나 빨리 오는지
// 실제 사용자 환경에서 페이지가 얼마나 빠르고 부드럽게 동작하는지 측정 가능

// 구글 검색 순위(SEO)에도 영향 줌

// PageSpeed Insights 점수의 원인을 구체적으로 알 수 있음


export default reportWebVitals;
