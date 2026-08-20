import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BackButton from "../components/common/BackButton";
import CustomerCard from "../components/common/CustomerCard";
import RecordEditor from "../components/record/RecordEditor";
import searchIcon from "../assets/search.svg";
import logoSrc from "../assets/logo.svg";
import { fetchCustomerDetail } from "../api/client";
import { useCustomerList } from "../hooks/useCustomerList";

function RecordListView() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { customers, loading, error } = useCustomerList(query);

  function goToRecord(customerId) {
    navigate(`/record/${customerId}`);
  }

  return (
    <div className="px-5 pb-[110px] pt-8">
      <img src={logoSrc} alt="logo" className="mb-2.5" />
      <h1 className="text-center text-[18px] font-bold text-ink">기록</h1>

      <div className="mt-6 flex items-center gap-2 rounded-[15px] border border-line px-4 py-3">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="고객명을 입력해주세요"
          className="w-full bg-transparent text-[14px] text-ink placeholder:text-muted focus:outline-none"
        />
        <img src={searchIcon} alt="" className="h-[18px] w-[18px] shrink-0" />
      </div>

      <p className="mb-2 mt-6 text-[15px] font-semibold text-ink">
        {query.trim() ? `검색 결과 ${customers.length}` : `고객 목록 ${customers.length}`}
      </p>

      <div className="flex flex-col gap-3">
        {loading && (
          <p className="py-6 text-center text-[13px] text-muted">
            불러오는 중...
          </p>
        )}
        {error && (
          <p className="py-6 text-center text-[13px] text-muted">{error}</p>
        )}
        {!loading &&
          !error &&
          customers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              badgeLabel={customer.grade}
              selected={selectedId === customer.id}
              onClick={() =>
                setSelectedId((prev) => (prev === customer.id ? null : customer.id))
              }
            />
          ))}
      </div>

      <button
        type="button"
        onClick={() => selectedId && goToRecord(selectedId)}
        disabled={!selectedId}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-line py-3.5 text-[14px] font-semibold text-muted transition-colors enabled:bg-ink enabled:text-white"
      >
        기록 작성하기 ›
      </button>
    </div>
  );
}

function RecordDetailView({ customerId }) {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchCustomerDetail(customerId)
      .then((customer) => {
        if (!cancelled) setCustomerName(customer.customerName);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [customerId]);

  if (loading || error) {
    return (
      <div className="px-5 pb-[110px] pt-8">
        <BackButton onClick={() => navigate("/record")} label="뒤로" />
        <p className="mt-6 text-[14px] text-muted">
          {error ?? "불러오는 중..."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col px-5 pb-[110px] pt-8">
      <div className="mb-5 flex items-center gap-3">
        <BackButton onClick={() => navigate("/record")} />
        <h1 className="text-[15px] font-semibold text-ink">
          {customerName} 고객님
        </h1>
      </div>

      <RecordEditor customerId={customerId} onSaved={() => navigate("/record")} />
    </div>
  );
}

function RecordPage() {
  const { customerId } = useParams();

  return customerId ? (
    <RecordDetailView key={customerId} customerId={customerId} />
  ) : (
    <RecordListView />
  );
}

export default RecordPage;
