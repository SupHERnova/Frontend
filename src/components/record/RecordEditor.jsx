import { useState } from "react";

import VoiceModal from "./VoiceModal";
import { createRecord, generateBriefing } from "../../api/client";

const MAX_LENGTH = 500;

const GUIDE_TIPS = [
  "고객이 관심을 보인 상품",
  "구매를 망설인 이유와 다음 연락 시점",
  "사이즈 컬러 관련 요청",
];

function RecordEditor({ customerId, onSaved }) {
  const [content, setContent] = useState("");
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [showSavedDialog, setShowSavedDialog] = useState(false);

  function handleTranscribed(text) {
    setContent((prev) => (prev ? `${prev}\n${text}` : text).slice(0, MAX_LENGTH));
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await createRecord(customerId, content);
      await generateBriefing(customerId, content);
      setShowSavedDialog(true);
    } catch (err) {
      setSaveError(err.message ?? "저장에 실패했어요. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-3 rounded-2xl border border-accent-soft bg-accent-soft/25 p-4">
        <p className="text-[13px] font-semibold text-ink">
          <span className="mr-1 text-accent">+</span>
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

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value.slice(0, MAX_LENGTH))}
        placeholder="내용을 입력해주세요."
        rows={8}
        className="
          w-full resize-none bg-transparent text-[13px] leading-relaxed
          text-ink placeholder:text-muted focus:outline-none
        "
      />
      <p className="text-right text-[11px] text-muted">
        {content.length} / {MAX_LENGTH}
      </p>

      {saveError && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-[13px] text-red-600">{saveError}</p>
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => setVoiceOpen(true)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ink py-3 text-[13px] font-medium text-ink"
        >
          <span className="text-[10px]">●</span> 음성 입력
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!content.trim() || saving}
          className="flex-1 rounded-full bg-ink py-3 text-[13px] font-semibold text-white disabled:opacity-40"
        >
          {saving ? "저장 중..." : "AI로 정리하고 저장"}
        </button>
      </div>

      {voiceOpen && (
        <VoiceModal
          onClose={() => setVoiceOpen(false)}
          onTranscribed={handleTranscribed}
        />
      )}

      {showSavedDialog && (
        <div className="absolute inset-0 z-70 flex items-center justify-center bg-black/40">
          <div className="mx-10 rounded-2xl bg-white px-6 py-6 text-center">
            <p className="text-[14px] font-medium text-ink">
              성공적으로 저장되었습니다
            </p>
            <button
              type="button"
              onClick={onSaved}
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
