import { useNavigate, useParams } from "react-router-dom";

import BackButton from "../components/common/BackButton";
import CustomerCard from "../components/recommend/CustomerCard";
import ProductCard from "../components/recommend/ProductCard";
import RecommendationMessage from "../components/recommend/RecommendationMessage";
import {
  BADGE_LABEL,
  contactStats,
  customers,
  getCustomerById,
} from "../data/mockCustomers";

function RecommendListView() {
  const navigate = useNavigate();

  return (
    <div className="px-5 pb-[110px] pt-8">
      <h1 className="text-center text-[15px] font-semibold text-ink">
        추천
      </h1>

      <section className="mt-6 rounded-[24px] bg-accent-soft/35 p-5">
        <p className="text-[20px] font-bold leading-snug text-ink">
          지금 연락하기 좋은
          <br />
          고객님이{" "}
          <span className="text-accent">{contactStats.readyCount}분</span>{" "}
          있어요
        </p>

        <div className="mt-4 flex gap-2">
          {contactStats.breakdown.map((item) => (
            <div
              key={item.label}
              className="flex-1 rounded-2xl bg-white px-3 py-3 text-center"
            >
              <p className="text-[12px] text-muted">{item.label}</p>
              <p className="mt-1 text-[16px] font-semibold text-ink">
                {item.count}건
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 flex flex-col gap-3">
        {customers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onClick={() => navigate(`/recommend/${customer.id}`)}
          />
        ))}
      </section>
    </div>
  );
}

function RecommendDetailView({ customerId }) {
  const navigate = useNavigate();
  const customer = getCustomerById(customerId);

  if (!customer) {
    return (
      <div className="px-5 pb-[110px] pt-8">
        <BackButton onClick={() => navigate("/recommend")} label="뒤로" />
        <p className="mt-6 text-[14px] text-muted">
          고객 정보를 찾을 수 없어요.
        </p>
      </div>
    );
  }

  const hasProducts = customer.recommendedProducts.length > 0;
  const hasSimilarCustomers = customer.similarCustomers.items.length > 0;

  return (
    <div className="px-5 pb-[110px] pt-8">
      <div className="flex items-center gap-3">
        <BackButton onClick={() => navigate("/recommend")} />
        <h1 className="text-[15px] font-semibold text-ink">
          {customer.name} 고객님
        </h1>
      </div>

      <section className="mt-5">
        <p className="mb-2 text-[13px] font-semibold text-ink">
          {BADGE_LABEL[customer.badge]}
        </p>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-2xl bg-ink px-4 py-3.5 text-left"
        >
          <div className="min-w-0">
            <p className="truncate text-[11px] text-white/60">
              {customer.pitch.topNote}
            </p>
            <p className="mt-1 truncate text-[14px] font-semibold text-white">
              {customer.pitch.productName}
            </p>
            <p className="mt-1 truncate text-[11px] text-white/60">
              {customer.pitch.bottomNote}
            </p>
          </div>
          <span className="shrink-0 pl-2 text-white/60">›</span>
        </button>
      </section>

      <section className="mt-6">
        <p className="mb-2 text-[13px] font-semibold text-ink">
          취향 매칭 추천 상품 {customer.recommendedProducts.length}
        </p>

        {hasProducts ? (
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5">
            {customer.recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-line px-4 py-6 text-center">
            <p className="text-[13px] font-medium text-ink">
              지금 추천할 수 있는 재고가 없어요
            </p>
            <p className="mt-1 text-[12px] text-muted">
              선호 브랜드 · 컬러 · 소재와 일치하는 재고가 현재 매장에 없습니다.
            </p>
          </div>
        )}
      </section>

      <section className="mt-6">
        {hasSimilarCustomers ? (
          <>
            <p className="mb-1 text-[13px] font-semibold text-ink">
              비슷한 취향의 고객은
            </p>
            <p className="mb-2 text-[13px] text-muted">
              최근 &lsquo;{customer.similarCustomers.topSearchedItem}&rsquo;를
              많이 찾았어요
            </p>
            <div className="flex flex-col gap-3 rounded-2xl border border-line px-4 py-3">
              {customer.similarCustomers.items.map((item, index) => (
                <div key={item.name}>
                  <div className="mb-1.5 flex items-center justify-between text-[12px]">
                    <span className="text-ink">{item.name}</span>
                    <span className="font-semibold text-accent">
                      {item.percent}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-line">
                    <div
                      className={`h-full rounded-full ${
                        index === 0 ? "bg-accent" : "bg-accent/50"
                      }`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="mb-2 text-[13px] font-semibold text-ink">
              비슷한 취향의 고객
            </p>
            <div className="rounded-2xl border border-line px-4 py-6 text-center">
              <p className="text-[13px] font-medium text-ink">
                비슷한 고객 데이터가 아직 부족해요
              </p>
              <p className="mt-1 text-[12px] text-muted">
                유사 고객의 데이터가 5건 이상 필요합니다.
              </p>
            </div>
          </>
        )}
      </section>

      <section className="mt-6">
        <p className="mb-2 text-[13px] font-semibold text-ink">
          추천 첫 멘트
        </p>
        <RecommendationMessage message={customer.openingLine} />
      </section>
    </div>
  );
}

function RecommendPage() {
  const { customerId } = useParams();

  return customerId ? (
    <RecommendDetailView customerId={customerId} />
  ) : (
    <RecommendListView />
  );
}

export default RecommendPage;
