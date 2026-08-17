import { BADGE_LABEL } from "../../data/mockCustomers";

function CustomerCard({ customer, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex w-full items-center gap-3
        rounded-2xl border border-line bg-white px-4 py-3.5
        text-left transition-colors
        active:bg-line/40
      "
    >
      <span className="h-14 w-14 shrink-0 rounded-full bg-line" />

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-[15px] font-semibold text-ink">
            {customer.name}
          </span>
          <span className="shrink-0 rounded-full bg-accent-soft px-2 py-[2px] text-[11px] font-medium text-accent">
            {BADGE_LABEL[customer.badge]}
          </span>
        </span>

        <span className="mt-1 block text-[12px] text-muted">
          {customer.gender} · {customer.age}세 · 최근 방문{" "}
          {customer.lastVisitDays}일 전
        </span>

        <span className="mt-2 flex flex-wrap gap-1.5">
          {customer.styleTags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-accent-soft/60 px-2 py-[2px] text-[11px] font-medium text-accent"
            >
              {tag}
            </span>
          ))}
        </span>
      </span>
    </button>
  );
}

export default CustomerCard;
