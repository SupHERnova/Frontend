import { useState } from "react";

function RecommendationMessage({ message }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 권한이 없는 환경(예: http)에서는 조용히 무시
    }
  }

  return (
    <div className="rounded-2xl border border-line p-4">
      <p className="text-[13px] leading-relaxed text-ink/90">{message}</p>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={handleCopy}
          className="
            rounded-full bg-ink px-4 py-1.5
            text-[12px] font-semibold text-white
            transition-opacity active:opacity-80
          "
        >
          {copied ? "복사됨" : "복사"}
        </button>
      </div>
    </div>
  );
}

export default RecommendationMessage;
