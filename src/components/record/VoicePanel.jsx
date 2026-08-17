import { useEffect, useRef, useState } from "react";

// TODO: 실제 STT/요약 API가 정해지면 이 함수만 교체하면 된다.
function summarizeRecording(durationSeconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        `(음성 ${durationSeconds}초 기록) 고객님과 상담한 주요 내용을 정리했습니다. 문의 상품과 다음 방문 예정을 확인해 주세요.`
      );
    }, 1600);
  });
}

function VoicePanel({ hasContent, onTranscribed, onSave, saving }) {
  const [phase, setPhase] = useState("idle"); // idle | recording | processing | done | error
  const [seconds, setSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      cleanupStream();
      clearInterval(timerRef.current);
    };
  }, []);

  function cleanupStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.start();

      setPhase("recording");
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      setErrorMessage(
        "마이크 접근 권한이 필요해요. 브라우저 설정을 확인해 주세요."
      );
      setPhase("error");
    }
  }

  function stopRecording() {
    clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
    cleanupStream();
    setPhase("processing");

    summarizeRecording(seconds).then((text) => {
      onTranscribed(text);
      setPhase("done");
    });
  }

  const showFooter =
    hasContent && phase !== "recording" && phase !== "processing";

  return (
    <div className="sticky bottom-[82px] z-10 -mx-5 rounded-t-3xl bg-ink px-5 pb-6 pt-4">
      <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />

      {phase === "idle" && (
        <button
          type="button"
          onClick={startRecording}
          className="flex w-full flex-col items-center gap-4 py-2"
        >
          <p className="text-center text-[14px] leading-relaxed text-white">
            아래 녹음 버튼을 눌러
            <br />
            음성 기록을 시작해주세요
          </p>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[20px] text-ink">
            ●
          </span>
        </button>
      )}

      {phase === "recording" && (
        <div className="flex flex-col items-center gap-4 py-2">
          <p className="text-[14px] text-white">편하게 말씀해주세요</p>
          <button
            type="button"
            onClick={stopRecording}
            aria-label="녹음 종료"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white"
          >
            <span className="h-4 w-4 rounded-[3px] bg-ink" />
          </button>
        </div>
      )}

      {phase === "processing" && (
        <div className="flex flex-col items-center gap-4 py-2">
          <p className="text-[14px] text-white">음성 변환 중입니다</p>
          <div className="h-14 w-14 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      )}

      {phase === "done" && (
        <div className="flex flex-col items-center gap-4 py-2">
          <p className="text-[14px] text-white">완료되었습니다</p>
          <button
            type="button"
            onClick={startRecording}
            aria-label="다시 녹음"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-[20px] text-white"
          >
            ●
          </button>
        </div>
      )}

      {phase === "error" && (
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <p className="text-[13px] text-white">{errorMessage}</p>
          <button
            type="button"
            onClick={startRecording}
            className="rounded-full border border-white/30 px-4 py-1.5 text-[12px] text-white"
          >
            다시 시도
          </button>
        </div>
      )}

      {showFooter && (
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="flex items-center gap-1.5 text-[12px] text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> 음성 입력
          </span>
          <button
            type="button"
            onClick={onSave}
            className="rounded-full bg-white px-4 py-1.5 text-[12px] font-semibold text-ink"
          >
            {saving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      )}
    </div>
  );
}

export default VoicePanel;
