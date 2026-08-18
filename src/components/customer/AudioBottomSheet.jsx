import { useEffect, useRef, useState } from "react";

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Speech Synthesis에서 15초 skip에 해당하는 대략적인 글자 수
const CHARS_PER_SECOND = 5;

function AudioBottomSheet({ audioUrl, scriptText, customerName, duration, onClose }) {
  const audioRef = useRef(null);
  const utteranceRef = useRef(null);
  const charIndexRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration ?? 0);

  const hasTtsFile = Boolean(audioUrl);

  function speakFrom(text, baseCharIndex = 0) {
    if (!text) { setPlaying(false); return; }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = 0.9;
    utterance.onboundary = (e) => { charIndexRef.current = baseCharIndex + e.charIndex; };
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    utteranceRef.current = utterance;

    window.speechSynthesis.cancel();
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
      setPlaying(true);
    }, 100);
  }

  useEffect(() => {
    if (hasTtsFile) {
      const audio = audioRef.current;
      if (!audio) return;
      audio.play().then(() => setPlaying(true)).catch(() => {});
      return () => { audio.pause(); };
    }

    if (!scriptText) return;
    charIndexRef.current = 0;
    speakFrom(scriptText, 0);

    return () => { window.speechSynthesis.cancel(); };
  }, []);

  function handleToggle() {
    if (hasTtsFile) {
      const audio = audioRef.current;
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        audio.play().then(() => setPlaying(true)).catch(() => {});
      }
    } else {
      if (playing) {
        window.speechSynthesis.pause();
        setPlaying(false);
      } else {
        window.speechSynthesis.resume();
        setPlaying(true);
      }
    }
  }

  function handleSkip(seconds) {
    if (hasTtsFile) {
      const audio = audioRef.current;
      audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, audio.duration || 0));
    } else {
      const charOffset = Math.round(seconds * CHARS_PER_SECOND);
      const newChar = Math.max(0, Math.min(charIndexRef.current + charOffset, (scriptText?.length ?? 1) - 1));
      speakFrom(scriptText.slice(newChar), newChar);
    }
  }

  return (
    <div className="absolute inset-0 z-60 flex items-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full rounded-t-[22px] bg-black px-6 pb-14 pt-3">
        <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-white/30" />

        <div className="flex items-center justify-between">
          <p className="text-[22px] font-bold text-white">음성 브리핑</p>
          <button type="button" onClick={onClose} className="text-[24px] text-white leading-none">×</button>
        </div>
        <div className="mt-5 mb-8 h-px w-full bg-white/20" />

        <div className="flex justify-center mb-6">
          <div className="h-44 w-44 rounded-full bg-white/20" />
        </div>

        <p className="text-center text-[18px] font-medium text-white mb-8">
          {customerName} 고객 브리핑
        </p>

        {hasTtsFile && (
          <div className="flex justify-between text-[13px] text-white/50 mb-6">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(totalDuration)}</span>
          </div>
        )}

        <div className="flex items-center justify-center gap-8">
          <button
            type="button"
            onClick={() => handleSkip(-15)}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-white/60 text-[15px] font-semibold text-white"
          >
            -15
          </button>

          <button
            type="button"
            onClick={handleToggle}
            className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[#4FA8E8]"
          >
            {playing ? (
              <span className="flex gap-[5px]">
                <span className="h-6 w-[4px] rounded-sm bg-white" />
                <span className="h-6 w-[4px] rounded-sm bg-white" />
              </span>
            ) : (
              <span className="ml-1 border-y-[12px] border-l-[20px] border-r-0 border-y-transparent border-l-white" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSkip(15)}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-white/60 text-[15px] font-semibold text-white"
          >
            +15
          </button>
        </div>

        {hasTtsFile && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
            onLoadedMetadata={(e) => setTotalDuration(e.target.duration)}
            onEnded={() => setPlaying(false)}
          />
        )}
      </div>
    </div>
  );
}

export default AudioBottomSheet;
