import previousIcon from "../../assets/previous.svg";

function BackButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="뒤로"
      className="flex items-center gap-2"
    >
      <img src={previousIcon} alt="" className="h-[14px] w-[8px]" />
      {label && <span className="text-[13px] text-muted">{label}</span>}
    </button>
  );
}

export default BackButton;
