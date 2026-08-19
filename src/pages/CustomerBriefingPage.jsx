import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import backIcon from "../assets/backIcon.svg";
import ProfileCard from "../components/customer/ProfileCard";
import StatCard from "../components/customer/StatCard";
import { fetchCustomerDetail } from "../api/client";
import { daysAgo } from "../utils/date";
import { BADGE_LABEL } from "../data/constants";

function mapCustomer(raw) {
  return {
    id: raw.customerId,
    name: raw.customerName,
    crmId: raw.crmId ?? "-",
    gender: raw.gender,
    age: raw.age,
    lastVisitDays: daysAgo(raw.lastVisitAt),
    totalPurchaseCount: raw.totalPurchaseCount ?? "-",
    totalPurchaseAmount: raw.totalPurchaseAmount ?? "-",
    phone: raw.phone ?? "-",
    saName: raw.saName ?? "-",
    preferredContactMethod: raw.preferredContactMethod ?? "-",
    recommendationType: raw.recommendationType,
    styleTags: raw.keywords ?? [],
  };
}

function useCustomerDetail(customerId) {
  const [state, setState] = useState({ loading: true, error: null, customer: null });

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, error: null, customer: null });

    fetchCustomerDetail(customerId)
      .then((raw) => {
        if (!cancelled) setState({ loading: false, error: null, customer: mapCustomer(raw) });
      })
      .catch((err) => {
        if (!cancelled) setState({ loading: false, error: err.message, customer: null });
      });

    return () => { cancelled = true; };
  }, [customerId]);

  return state;
}

export default function CustomerBriefingPage() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { loading, error, customer } = useCustomerDetail(customerId);

  if (loading) {
    return (
      <div className="px-5 pt-8">
        <button type="button" onClick={() => navigate(-1)}>
          <img src={backIcon} alt="뒤로" />
        </button>
        <p className="mt-6 text-[14px] text-muted">불러오는 중...</p>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="px-5 pt-8">
        <button type="button" onClick={() => navigate(-1)}>
          <img src={backIcon} alt="뒤로" />
        </button>
        <p className="mt-6 text-[14px] text-muted">{error ?? "고객 정보를 찾을 수 없어요"}</p>
      </div>
    );
  }

  const totalPurchaseValue = customer.totalPurchaseCount !== "-"
    ? `${customer.totalPurchaseCount}회`
    : "-";
  const totalAmountValue = customer.totalPurchaseAmount !== "-"
    ? `${Number(customer.totalPurchaseAmount).toLocaleString()}₩`
    : "-";
  const lastVisitValue = customer.lastVisitDays != null
    ? `${customer.lastVisitDays}일 전`
    : "-";

  return (
    <div className="px-5 pb-[110px] pt-[59px]">
      <button type="button" onClick={() => navigate(-1)}>
        <img src={backIcon} alt="뒤로" />
      </button>
      <div className="mt-[13px] mb-5">
        <ProfileCard
          customer={customer}
          badgeLabel={BADGE_LABEL[customer.recommendationType]}
        />
      </div>
      <div className="flex gap-2 mb-7">
        <StatCard label="누적 구매" value={totalPurchaseValue} />
        <StatCard label="누적 금액" value={totalAmountValue} />
        <StatCard label="최근 방문" value={lastVisitValue} />
      </div>
      <div className="flex items-center justify-between mb-[10px]">
        <p className="text-[18px] font-bold">고객 정보</p>
        <p className="text-[12px] text-gray-500">수정</p>
      </div>
      <div className="w-full rounded-[15px] border border-line bg-white px-[27px] py-8 flex flex-col gap-4 mb-[23px]">
        {[
          { label: "연락처", value: customer.phone },
          { label: "담당 SA", value: customer.saName},
          { label: "선호 연락", value: customer.preferredContactMethod },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between">
            <p className="text-[14px] text-muted">{label}</p>
            <p className="text-[14px] font-medium text-ink">{value}</p>
          </div>
        ))}
      </div>
      <div>
        <h2 className="font-semibold text-[20px]">
          {customer.name} 고객과의 <br /> 다음 응대를 준비했어요
        </h2>
        <p className="text-[12px] text-gray-500">구매 이력·취향·미해결 요청과 재고를 분석했습니다.</p>
      </div>
      <button
        type="button"
        className="mt-7 w-full h-[50px] bg-black text-white rounded-[15px]"
        onClick={() => navigate(`/customers/${customerId}/briefing`)}
      >
        브리핑 열기
      </button>
    </div>
  );
}
