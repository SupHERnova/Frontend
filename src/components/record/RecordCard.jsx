const STATUS_TONE = {
  작성완료: "bg-accent-soft text-accent",
  임시저장: "bg-line text-muted",
};

function RecordCard({ record, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex w-full flex-col gap-1 rounded-2xl border border-line px-4 py-3
        text-left transition-colors active:bg-line/40
      "
    >
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-medium text-ink">
          {record.customerName}
        </span>
        <span
          className={`rounded-full px-2 py-[2px] text-[11px] font-medium ${
            STATUS_TONE[record.status] ?? STATUS_TONE.임시저장
          }`}
        >
          {record.status}
        </span>
      </div>

      <p className="truncate text-[12px] text-muted">{record.summary}</p>
      <p className="text-[11px] text-muted">{record.date}</p>
    </button>
  );
}

export default RecordCard;
