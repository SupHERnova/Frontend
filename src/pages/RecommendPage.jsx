import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BackButton from "../components/common/BackButton";
import CustomerCard from "../components/common/CustomerCard";
import ProductCard from "../components/recommend/ProductCard";
import RecommendationMessage from "../components/recommend/RecommendationMessage";
import { fetchCustomerDetail, fetchRecommendation } from "../api/client";
import { BADGE_LABEL } from "../data/constants";
import { useCustomerList } from "../hooks/useCustomerList";
import logoSrc from "../assets/logo.svg";

function RecommendListView() {
  const navigate = useNavigate();
  const { customers, loading, error } = useCustomerList("");

  const restockCount = customers.filter(
    (c) => c.recommendationType === "RESTOCK"
  ).length;
  const highMatchCount = customers.filter(
    (c) => c.recommendationType === "HIGH_MATCH"
  ).length;

  return (
    <div className="px-5 pb-[110px] pt-8">
      <img src={logoSrc} alt="logo" className="mb-2.5" />
      <h1 className="text-center text-[18px] font-bold text-ink">추천</h1>

      <section className="mt-6 rounded-[15px] border border-accent-soft bg-surface p-5">
        <p className="text-[30px] font-bold leading-[1.3] text-ink">
          지금 연락하기 좋은
          <br />
          고객님이{" "}
          <span className="text-accent">{restockCount + highMatchCount}분</span>{" "}
          있어요
        </p>

        <div className="mt-4 flex gap-2">
          <div className="flex-1 rounded-[15px] border border-line bg-white px-3 py-3 text-center">
            <p className="text-[12px] text-muted">재입고 상품</p>
            <p className="mt-1 text-[15px] font-semibold text-ink">
              {restockCount}건
            </p>
          </div>
          <div className="flex-1 rounded-[15px] border border-line bg-white px-3 py-3 text-center">
            <p className="text-[12px] text-muted">고일치 상품</p>
            <p className="mt-1 text-[15px] font-semibold text-ink">
              {highMatchCount}건
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 flex flex-col gap-3">
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
              badgeLabel={BADGE_LABEL[customer.recommendationType]}
              onClick={() => navigate(`/recommend/${customer.id}`)}
            />
          ))}
      </section>
    </div>
  );
}

function useRecommendationDetail(customerId) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    customerName: "",
    recommendation: null,
  });

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetchCustomerDetail(customerId),
      fetchRecommendation(customerId),
    ])
      .then(([customer, recommendation]) => {
        if (cancelled) return;
        setState({
          loading: false,
          error: null,
          customerName: customer.customerName,
          recommendation,
        });
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            loading: false,
            error: err.message,
            customerName: "",
            recommendation: null,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [customerId]);

  return state;
}

function RecommendDetailView({ customerId }) {
  const navigate = useNavigate();
  const { loading, error, customerName, recommendation } =
    useRecommendationDetail(customerId);

  if (loading || error) {
    return (
      <div className="px-5 pb-[110px] pt-8">
        <BackButton onClick={() => navigate("/recommend")} label="뒤로" />
        <p className="mt-6 text-[14px] text-muted">
          {error ?? "불러오는 중..."}
        </p>
      </div>
    );
  }

  const { restockedProduct, matchedProducts, similarCustomerStats, recommendationComment } =
    recommendation;

  const isRestock = Boolean(restockedProduct);
  const topMatch = matchedProducts?.[0];

  const pitch = isRestock
    ? {
        label: BADGE_LABEL.RESTOCK,
        topNote: restockedProduct.slotReason,
        productName: `${restockedProduct.productName} · ${restockedProduct.size}`,
        bottomNote: `재입고 ${restockedProduct.restockedCount}개`,
      }
    : topMatch
      ? {
          label: BADGE_LABEL.HIGH_MATCH,
          topNote: "취향 매칭 상품",
          productName: topMatch.productName,
          bottomNote: `매치율 ${topMatch.matchRate}%`,
        }
      : null;

  const hasProducts = (matchedProducts?.length ?? 0) > 0;
  const hasSimilarStats =
    Boolean(similarCustomerStats?.isAvailable) &&
    (similarCustomerStats?.ratios?.length ?? 0) > 0;

  return (
    <div className="px-5 pb-[110px] pt-8">
      <div className="flex items-center gap-3">
        <BackButton onClick={() => navigate("/recommend")} />
        <h1 className="text-[15px] font-semibold text-ink">
          {customerName} 고객님
        </h1>
      </div>

      {pitch && (
        <section className="mt-5">
          <p className="mb-2 text-[13px] font-semibold text-ink">
            {pitch.label}
          </p>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-2xl bg-ink px-4 py-3.5 text-left"
          >
            <div className="min-w-0">
              <p className="truncate text-[11px] text-white/60">
                {pitch.topNote}
              </p>
              <p className="mt-1 truncate text-[14px] font-semibold text-white">
                {pitch.productName}
              </p>
              <p className="mt-1 truncate text-[11px] text-white/60">
                {pitch.bottomNote}
              </p>
            </div>
            <span className="shrink-0 pl-2 text-white/60">›</span>
          </button>
        </section>
      )}

      <section className="mt-6">
        <p className="mb-2 text-[13px] font-semibold text-ink">
          취향 매칭 추천 상품 {matchedProducts?.length ?? 0}
        </p>

        {hasProducts ? (
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5">
            {matchedProducts.map((product) => (
              <ProductCard
                key={product.productId}
                product={{
                  name: product.productName,
                  price: product.price,
                  matchRate: product.matchRate,
                  imageUrl: product.imageUrl,
                }}
              />
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
        {hasSimilarStats ? (
          <>
            <p className="mb-1 text-[13px] font-semibold text-ink">
              비슷한 취향의 고객은
            </p>
            <p className="mb-2 text-[13px] text-muted">
              최근 &lsquo;{similarCustomerStats.topProductName}&rsquo;를 많이
              찾았어요
            </p>
            <div className="flex flex-col gap-3 rounded-2xl border border-line px-4 py-3">
              {similarCustomerStats.ratios.map((item, index) => (
                <div key={item.productName}>
                  <div className="mb-1.5 flex items-center justify-between text-[12px]">
                    <span className="text-ink">{item.productName}</span>
                    <span className="font-semibold text-accent">
                      {item.ratio}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-line">
                    <div
                      className={`h-full rounded-full ${
                        index === 0 ? "bg-accent" : "bg-accent/50"
                      }`}
                      style={{ width: `${item.ratio}%` }}
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
                {similarCustomerStats?.reasonMessage ?? "유사 고객의 데이터가 5건 이상 필요합니다."}
              </p>
            </div>
          </>
        )}
      </section>

      <section className="mt-6">
        <p className="mb-2 text-[13px] font-semibold text-ink">
          추천 첫 멘트
        </p>
        <RecommendationMessage message={recommendationComment} />
      </section>
    </div>
  );
}

function RecommendPage() {
  const { customerId } = useParams();

  return customerId ? (
    <RecommendDetailView key={customerId} customerId={customerId} />
  ) : (
    <RecommendListView />
  );
}

export default RecommendPage;
