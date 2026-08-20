import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CustomerCard from "../components/common/CustomerCard";
import searchIcon from "../assets/search.svg";
import logoSrc from "../assets/logo.svg";
import { useCustomerList } from "../hooks/useCustomerList";

export default function BriefingPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { customers, loading, error } = useCustomerList(search);

  return (
    <div className="px-5 pb-[110px] pt-8">
      <img src={logoSrc} alt="logo" className="mb-2.5" />
      <p className="text-center text-[18px] font-bold text-ink">브리핑</p>

      <div className="relative mt-5 mb-9">
        <input
          type="text"
          placeholder="고객명을 입력하세요"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-[73px] rounded-[12px] border border-line bg-white px-4 py-3 text-[14px] text-ink placeholder:text-muted outline-none focus:border-accent"
        />
        <img
          src={searchIcon}
          alt="검색"
          className="absolute right-[27px] top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
        />
      </div>

      <div className="w-full flex justify-between items-baseline">
        <p className="font-semibold text-[18px]">
          {search ? `검색 결과 ${customers.length}건` : "고객 목록"}
        </p>
        <p className="text-[12px] text-gray-600">시간순</p>
      </div>

      <section className="mt-4 flex flex-col gap-3">
        {loading && (
          <p className="py-6 text-center text-[13px] text-muted">불러오는 중...</p>
        )}
        {error && (
          <p className="py-6 text-center text-[13px] text-muted">{error}</p>
        )}
        {!loading && !error && customers.length === 0 && (
          <p className="py-6 text-center text-[13px] text-muted">일치하는 고객이 없어요</p>
        )}
        {!loading && !error && customers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            badgeLabel={customer.grade}
            onClick={() => navigate(`/customers/${customer.id}/briefing`)}
          />
        ))}
      </section>
    </div>
  );
}
