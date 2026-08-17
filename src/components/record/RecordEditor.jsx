import { useState } from "react";
import { useNavigate } from "react-router-dom";

import VoicePanel from "./VoicePanel";

const GUIDE_TIPS = [
  "고객이 관심을 보인 상품",
  "매장을 방문한 이유나 시점",
  "서비스 응대 시 특이사항",
];

function RecordEditor({ pastRecords, onSave }) {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [showSavedDialog, setShowSavedDialog] = useState(false);

  function handleTranscribed(text) {
    setContent((prev) => (prev ? `${prev}\n${text}` : text));
  }

  function handleSave() {
    onSave(content);
    setShowSavedDialog(true);
  }

  return (
    <div>
      {!content && (
        <div className="mb-3 rounded-2xl bg-accent-soft/25 p-4">
          <p className="text-[13px] font-semibold text-ink">
            기록하면 좋은 내용
          </p>
          <ul className="mt-2 flex flex-col gap-1">
            {GUIDE_TIPS.map((tip) => (
              <li key={tip} className="text-[12px] text-muted">
                · {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="내용을 입력해주세요"
        rows={8}
        className="
          w-full resize-none bg-transparent text-[13px] leading-relaxed
          text-ink placeholder:text-muted focus:outline-none
        "
      />

      {pastRecords.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-[13px] font-medium text-muted">
            이전 기록
          </p>
          <div className="flex flex-col gap-2">
            {pastRecords.map((record) => (
              <div
                key={record.id}
                className="rounded-2xl border border-line px-4 py-3"
              >
                <p className="text-[12px] text-muted">{record.date}</p>
                <p className="mt-1 text-[13px] text-ink/90">
                  {record.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <VoicePanel
        hasContent={Boolean(content.trim())}
        onTranscribed={handleTranscribed}
        onSave={handleSave}
      />

      {showSavedDialog && (
        <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/40">
          <div className="mx-10 rounded-2xl bg-white px-6 py-6 text-center">
            <p className="text-[14px] font-medium text-ink">
              성공적으로 저장되었습니다
            </p>
            <button
              type="button"
              onClick={() => navigate("/record")}
              className="mt-4 w-full rounded-full bg-ink py-2.5 text-[13px] font-semibold text-white"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecordEditor;
