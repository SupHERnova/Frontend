function StatCard({ label, value }) {
  return (
    <div className="flex flex-1 flex-col justify-center items-center h-[79px] border border-gray-200 rounded-[15px]">
      <p className="text-[12px] text-muted">{label}</p>
      <p className="mt-1 text-[15px] font-bold text-ink">{value}</p>
    </div>
  );
}

export default StatCard;
