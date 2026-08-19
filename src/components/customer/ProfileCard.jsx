function ProfileCard({ customer, badgeLabel }) {
  return (
    <div className="w-full h-[116px] flex items-center gap-4 rounded-[15px] border border-[#C3E6FF] bg-[#F9FDFF] px-4 py-4">
      <span className="h-14 w-14 shrink-0 rounded-full bg-line" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[20px] font-bold text-ink">{customer.name}</span>
          {badgeLabel && (
            <span className="shrink-0 rounded-full bg-ink px-2 py-[2px] text-[11px] font-medium text-white">
              {badgeLabel}
            </span>
          )}
        </div>
        <p className="mt-1 text-[13px] text-muted">
          CRM ID · {customer.crmId}
        </p>
      </div>
    </div>
  );
}

export default ProfileCard;
