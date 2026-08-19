import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import backIcon from "../assets/backIcon.svg";
import ProductCard from "../components/recommend/ProductCard";
import RecommendationMessage from "../components/recommend/RecommendationMessage";
import AudioBottomSheet from "../components/customer/AudioBottomSheet";
import { fetchRecommendation, fetchBriefingContext, fetchBriefingById } from "../api/client";

function useBriefingDetail(customerId) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    customerName: "",
    recommendation: null,
    briefingId: null,
    context: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [recommendation, context] = await Promise.all([
          fetchRecommendation(customerId).catch(() => null),
          fetchBriefingContext(customerId).catch(() => null),
        ]);

        if (!cancelled) {
          setState({
            loading: false,
            error: null,
            customerName: context?.customerName ?? "",
            recommendation,
            briefingId: context?.briefingId ?? null,
            context,
          });
        }
      } catch (err) {
        if (!cancelled)
          setState({ loading: false, error: err.message, customerName: "", recommendation: null, briefingId: null, context: null });
      }
    }

    load();
    return () => { cancelled = true; };
  }, [customerId]);

  return state;
}

export default function BriefingDetailPage() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { loading, error, customerName, recommendation, briefingId, context } = useBriefingDetail(customerId);
  const [activeBriefing, setActiveBriefing] = useState(null);

  async function handlePlayBriefing() {
    if (!briefingId) return;
    const briefing = await fetchBriefingById(briefingId).catch(() => null);
    if (briefing) setActiveBriefing(briefing);
  }

  if (loading || error) {
    return (
      <div className="px-5 pb-[110px] pt-8">
        <header className="relative flex items-center justify-center">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-0">
            <img src={backIcon} alt="뒤로" />
          </button>
        </header>
        <p className="mt-6 text-[14px] text-muted">{error ?? "불러오는 중..."}</p>
      </div>
    );
  }

  const { restockedProduct, matchedProducts, recommendationComment } = recommendation ?? {};

  const isRestock = Boolean(restockedProduct);
  const topMatch = matchedProducts?.[0];

  const pitch = isRestock
    ? {
        topNote: restockedProduct.matchReason,
        productName: `${restockedProduct.productName} · ${restockedProduct.size}`,
        bottomNote: `재입고 ${restockedProduct.restockedCount}개`,
      }
    : topMatch
      ? {
          topNote: "취향 매칭 상품",
          productName: topMatch.productName,
          bottomNote: `매치율 ${topMatch.matchRate}%`,
        }
      : null;

  const hasProducts = (matchedProducts?.length ?? 0) > 0;

  const { preferredKeywords, recentPurchases = [], similarCustomerStats } = context ?? {};
  const hasSimilarStats = similarCustomerStats?.isAvailable && (similarCustomerStats?.ratios?.length ?? 0) > 0;

  const preferences = [
    { label: "브랜드", value: preferredKeywords?.brand ?? "-" },
    { label: "컬러", value: preferredKeywords?.color ?? "-" },
    { label: "소재", value: preferredKeywords?.material ?? "-" },
    { label: "무드", value: preferredKeywords?.mood ?? "-" },
  ];

  return (
    <div className="px-5 pb-[110px] pt-8">
      <header className="relative flex items-center justify-center">
        <button type="button" onClick={() => navigate(-1)} className="absolute left-0">
          <img src={backIcon} alt="뒤로" />
        </button>
        <p className="text-[18px] font-semibold text-ink">{customerName} 고객님</p>
      </header>

      <section className="mt-6">
        <RecommendationMessage message={recommendationComment} />
      </section>

      {pitch && (
        <section className="mt-5">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-2xl bg-ink px-4 py-3.5 text-left"
          >
            <div className="min-w-0">
              <p className="truncate text-[11px] text-white/60">{pitch.topNote}</p>
              <p className="mt-1 truncate text-[14px] font-semibold text-white">{pitch.productName}</p>
              <p className="mt-1 truncate text-[11px] text-white/60">{pitch.bottomNote}</p>
            </div>
            <span className="shrink-0 pl-2 text-white/60">›</span>
          </button>
        </section>
      )}

      <section className="mt-6">
        <p className="mb-2 text-[13px] font-semibold text-ink">추천 상품</p>
        {hasProducts ? (
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5">
            {matchedProducts.map((product) => (
              <ProductCard
                key={product.productId}
                product={{ name: product.productName, price: product.price, matchRate: product.matchRate, imageUrl: product.imageUrl }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-line px-4 py-6 text-center">
            <p className="text-[13px] font-medium text-ink">지금 추천할 수 있는 재고가 없어요</p>
            <p className="mt-1 text-[12px] text-muted">
              선호 브랜드 · 컬러 · 소재와 일치하는 재고가 현재 매장에 없습니다.
            </p>
          </div>
        )}
      </section>

      {/* 선호 취향 */}
      <section className="mt-6">
        <p className="mb-3 text-[20px] font-bold text-ink">선호 취향</p>
        <div className="rounded-2xl border border-line bg-white overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-y divide-line">
            {preferences.map(({ label, value }) => (
              <div key={label} className="px-5 py-4">
                <p className="text-[11px] text-muted">{label}</p>
                <p className="mt-1 text-[15px] font-semibold text-ink">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 최근 구매 */}
      <section className="mt-6">
        <p className="mb-3 text-[20px] font-bold text-ink">최근 구매</p>
        <div className="rounded-2xl border border-line bg-white px-5 py-4">
          {recentPurchases.length === 0 ? (
            <p className="py-4 text-center text-[13px] text-muted">구매 이력이 없어요</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {recentPurchases.map((item) => (
                <li key={item.orderId} className="flex gap-3">
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-ink" />
                  <div>
                    <p className="text-[11px] text-muted">{item.purchasedAt}</p>
                    <p className="mt-0.5 text-[14px] font-semibold text-ink">{item.productName}</p>
                    <p className="mt-0.5 text-[12px] text-muted">
                      {item.color} · ₩{Number(item.price).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>


      {/* 비슷한 취향의 고객 */}
      <section className="mt-6">
        {hasSimilarStats ? (
          <div className="rounded-2xl border border-gray-200 px-5 py-5">
            <p className="text-[16px] font-bold leading-snug text-ink">
              비슷한 취향의 고객은
              <br />
              최근{" "}
              <span className="text-accent">
                &lsquo;{similarCustomerStats.topProductName}&rsquo;
              </span>
              를 많이 찾았어요.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {similarCustomerStats.ratios.map((item, index) => (
                <div key={item.productName} className="flex items-center gap-2 text-[13px]">
                  <span className="w-24 shrink-0 truncate text-ink">{item.productName}</span>
                  <div className="h-2 flex-1 rounded-full bg-line">
                    <div
                      className={`h-full rounded-full ${index === 0 ? "bg-accent" : "bg-accent/40"}`}
                      style={{ width: `${item.ratio}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right font-semibold text-ink">{item.ratio}%</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11px] text-muted">
              취향 태그 4개 이상이 일치하는 고객군의 최근 30일 구매 기준
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-line px-4 py-6 text-center">
            <p className="text-[13px] font-medium text-ink">비슷한 고객 데이터가 아직 부족해요</p>
            <p className="mt-1 text-[12px] text-muted">
              {similarCustomerStats?.reasonMessage ?? "유사 고객의 데이터가 5건 이상 필요합니다."}
            </p>
          </div>
        )}
      </section>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          className="w-[143px] h-[52px] text-[15px] border border-gray-200 rounded-[15px]"
          onClick={handlePlayBriefing}
        >
          ▶ 브리핑 듣기
        </button>
        <button
          type="button"
          className="w-[202px] h-[52px] bg-black text-white text-[15px] py-4 rounded-[15px]"
          onClick={() => navigate(`/record/${customerId}`)}
        >
          응대 시작하기
        </button>
      </div>

      {activeBriefing && (
        <AudioBottomSheet
          audioUrl={activeBriefing.ttsAudioUrl}
          scriptText={activeBriefing.scriptText}
          customerName={customerName}
          duration={activeBriefing.ttsDuration}
          onClose={() => setActiveBriefing(null)}
        />
      )}
    </div>
  );
}
