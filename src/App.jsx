import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Recommend from "./pages/RecommendPage.jsx";
import Record from "./pages/RecordPage.jsx";
import BottomNav from "./components/common/BottomNav";

function App() {
  return (
    <BrowserRouter>
      {/* 393x852 고정 프레임 안에서만 스크롤되는 콘텐츠 영역 */}
      <div className="no-scrollbar h-full w-full overflow-y-auto">
        <Routes>
          {/* 추천 페이지: 목록 / 상세(고객 선택 후) */}
          <Route path="/" element={<Navigate to="/recommend" replace />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/recommend/:customerId" element={<Recommend />} />

          {/* 기록 페이지: 고객 선택 전/후 모두 보여주기 위해 두 경로를 허용 */}
          <Route path="/record" element={<Record />} />
          <Route path="/record/:customerId" element={<Record />} />

        </Routes>
      </div>

      {/* 전역 하단 내비게이션: 프레임 하단에 고정 */}
      <BottomNav />
    </BrowserRouter>
  );
}

export default App;