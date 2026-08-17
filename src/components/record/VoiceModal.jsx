import { useEffect, useRef, useState } from "react";

const SpeechRecognitionApi =
  window.SpeechRecognition || window.webkitSpeechRecognition;

function VoiceModal({ onClose, onTranscribed }) {
  const [phase, setPhase] = useState("idle"); // idle | recording | processing | done | error
  const [errorMessage, setErrorMessage] = useState("");

  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const closeTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      clearTimeout(closeTimerRef.current);
    };
  }, []);

  function startRecording() {
    if (!SpeechRecognitionApi) {
      setErrorMessage(
        "이 브라우저는 음성 인식을 지원하지 않아요. Chrome이나 Edge를 사용해 주세요."
      );
      setPhase("error");
      return;
    }

    const recognition = new SpeechRecognitionApi();
    recognition.lang = "ko-KR";
    recognition.continuous = true;
    recognition.interimResults = false;

    transcriptRef.current = "";

    recognition.onresult = (event) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      transcriptRef.current += text;
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setErrorMessage(
          "마이크 접근 권한이 필요해요. 브라우저 설정을 확인해 주세요."
        );
        setPhase("error");
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setPhase("recording");
    } catch {
      setErrorMessage(
        "마이크 접근 권한이 필요해요. 브라우저 설정을 확인해 주세요."
      );
      setPhase("error");
    }
  }

  function stopRecording() {
    setPhase("processing");

    const recognition = recognitionRef.current;
    recognition.onend = () => {
      const text = transcriptRef.current.trim();
      if (text) onTranscribed(text);
      setPhase("done");
      closeTimerRef.current = setTimeout(onClose, 1200);
    };
    recognition.stop();
  }

  return (
    <div className="absolute inset-0 z-[60] flex items-end justify-center bg-black/50">
      <div className="w-full rounded-t-3xl bg-ink px-5 pb-8 pt-5">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />

        {phase === "idle" && (
          <button
            type="button"
            onClick={startRecording}
            className="flex w-full flex-col items-center gap-4 py-4"
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
          <div className="flex flex-col items-center gap-4 py-4">
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
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-[14px] text-white">음성 변환 중입니다</p>
            <div className="h-14 w-14 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          </div>
        )}

        {phase === "done" && (
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-[14px] text-white">완료되었습니다</p>
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-[20px] text-white">
              ●
            </span>
          </div>
        )}

        {phase === "error" && (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
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

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full text-center text-[12px] text-white/60"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default VoiceModal;
