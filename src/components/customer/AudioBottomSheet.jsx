import { useEffect, useRef, useState } from "react";

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function AudioBottomSheet({ audioUrl, scriptText, customerName, duration, onClose }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration ?? 0);

  const hasTtsFile = Boolean(audioUrl);

  useEffect(() => {
    if (hasTtsFile) {
      const audio = audioRef.current;
      if (!audio) return;
      audio.play().then(() => setPlaying(true)).catch(() => {});
      return () => { audio.pause(); };
    }

    if (!scriptText) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(scriptText);
    utterance.lang = "ko-KR";
    utterance.rate = 0.9;
    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => setPlaying(false);
    utterance.onpause = () => setPlaying(false);
    utterance.onresume = () => setPlaying(true);
    window.speechSynthesis.speak(utterance);
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
    if (!hasTtsFile) return;
    const audio = audioRef.current;
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, audio.duration || 0));
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
            disabled={!hasTtsFile}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-white/60 text-[15px] font-semibold text-white disabled:opacity-30"
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
            disabled={!hasTtsFile}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-white/60 text-[15px] font-semibold text-white disabled:opacity-30"
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
