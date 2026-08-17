function CustomerCard({ customer, badgeLabel, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex w-full appearance-none items-center gap-3
        rounded-[15px] border bg-white px-4 py-4
        text-left transition-colors
        active:bg-line/40
        ${selected ? "border-accent-soft" : "border-line"}
      `}
    >
      <span className="h-12 w-12 shrink-0 rounded-full bg-line" />

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-[18px] font-semibold text-ink">
            {customer.name}
          </span>
          {badgeLabel && (
            <span className="shrink-0 rounded-full bg-ink px-2 py-[2px] text-[11px] font-medium text-white">
              {badgeLabel}
            </span>
          )}
        </span>

        <span className="mt-1 block text-[12px] text-muted">
          {customer.gender} · {customer.age}세
          {customer.lastVisitDays != null && ` · 최근 방문 ${customer.lastVisitDays}일 전`}
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
