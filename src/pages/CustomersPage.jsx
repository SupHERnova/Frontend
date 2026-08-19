import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import CustomerCard from "../components/common/CustomerCard";
import BackButton from "../components/common/BackButton";
import searchIcon from "../assets/search.svg";
import { useCustomerList } from "../hooks/useCustomerList";

function SearchInput({ value, onChange }) {
  return (
    <div className="relative mt-5 mb-9">
      <input
        type="text"
        placeholder="고객명을 입력하세요"
        value={value}
        onChange={onChange}
        className="w-full h-[73px] rounded-[12px] border border-line bg-white px-4 py-3 text-[14px] text-ink placeholder:text-muted outline-none focus:border-accent"
      />
      <img
        src={searchIcon}
        alt="검색"
        className="absolute right-[27px] top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
      />
    </div>
  );
}

function CustomerList({ customers, loading, error, onClickCustomer }) {
  if (loading) return <p className="py-6 text-center text-[13px] text-muted">불러오는 중...</p>;
  if (error) return <p className="py-6 text-center text-[13px] text-muted">{error}</p>;

  return customers.map((customer) => (
    <CustomerCard
      key={customer.id}
      customer={customer}
      badgeLabel={customer.grade}
      onClick={() => onClickCustomer(customer.id)}
    />
  ));
}

function CustomersMainView() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { customers, loading, error } = useCustomerList(search, 4);

  return (
    <div className="px-5 pb-[110px] pt-8">
      <p className="mb-[10px] text-gray-200">LOGO</p>
      <h1 className="text-left text-[30px] font-bold text-ink">
        오늘의 고객을
        <br /> 준비해볼까요?
      </h1>

      <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="w-full flex justify-between items-baseline">
        <p className="font-semibold text-[18px]">
          {search ? `검색 결과 ${customers.length}건` : "고객 목록"}
        </p>
        {!search && (
          <button
            type="button"
            className="text-[12px] text-gray-600"
            onClick={() => navigate("/customers/all")}
          >
            전체보기
          </button>
        )}
      </div>

      <section className="mt-4 flex flex-col gap-3">
        {!loading && !error && customers.length === 0 ? (
          <div className="w-full mt-[91px] h-full flex flex-col justify-center items-center">
            <p className="text-[18px] font-semibold">일치하는 고객이 없어요</p>
            <p className="py-6 text-center text-[13px] text-muted">
              이름을 다시 확인하거나
              <br />전체 고객 목록에서 찾아보세요.
            </p>
            <button
              type="button"
              className="w-[188px] h-[52px] border border-gray-200 rounded-[15px]"
              onClick={() => navigate("/customers/all")}
            >
              전체 고객 보기
            </button>
          </div>
        ) : (
          <CustomerList
            customers={customers}
            loading={loading}
            error={error}
            onClickCustomer={(id) => navigate(`/customers/${id}`)}
          />
        )}
      </section>
    </div>
  );
}

function CustomersAllView() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { customers, loading, error } = useCustomerList(search, 9999);

  const sorted = [...customers].sort((a, b) => a.lastVisitDays - b.lastVisitDays);

  return (
    <div className="px-5 pb-[110px] pt-8">
      <BackButton onClick={() => navigate("/customers")} />

      <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="mt-5 w-full flex justify-between items-baseline">
        <h1 className="text-[20px] font-bold text-ink">
          {search ? `검색 결과 ${sorted.length}건` : "고객 목록"}
        </h1>
        {!search && <p className="text-[12px] text-gray-600">최근 방문순</p>}
      </div>

      <section className="mt-4 flex flex-col gap-3">
        {!loading && !error && sorted.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-muted">일치하는 고객이 없어요</p>
        ) : (
          <CustomerList
            customers={sorted}
            loading={loading}
            error={error}
            onClickCustomer={(id) => navigate(`/customers/${id}`)}
          />
        )}
      </section>
    </div>
  );
}

export default function CustomersPage() {
  const { pathname } = useLocation();
  return pathname === "/customers/all" ? <CustomersAllView /> : <CustomersMainView />;
}
