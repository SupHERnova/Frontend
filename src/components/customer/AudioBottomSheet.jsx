import { useEffect, useRef, useState } from "react";

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function AudioBottomSheet({ audioUrl, customerName, duration, onClose }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration ?? 0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().then(() => setPlaying(true)).catch(() => {});
    return () => { audio.pause(); };
  }, []);

  function handleToggle() {
    const audio = audioRef.current;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  function handleSkip(seconds) {
    const audio = audioRef.current;
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, audio.duration || 0));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full rounded-t-[22px] bg-black px-6 pb-14 pt-3">
        {/* 드래그 핸들 */}
        <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-white/30" />

        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <p className="text-[22px] font-bold text-white">음성 브리핑</p>
          <button type="button" onClick={onClose} className="text-[24px] text-white leading-none">×</button>
        </div>
        <div className="mt-5 mb-8 h-px w-full bg-white/20" />

        {/* 앨범 아트 */}
        <div className="flex justify-center mb-6">
          <div className="h-44 w-44 rounded-full bg-white/20" />
        </div>

        {/* 제목 */}
        <p className="text-center text-[18px] font-medium text-white mb-8">
          {customerName} 고객 브리핑
        </p>

        {/* 시간 */}
        <div className="flex justify-between text-[13px] text-white/50 mb-6">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>

        {/* 컨트롤 */}
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

        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
          onLoadedMetadata={(e) => setTotalDuration(e.target.duration)}
          onEnded={() => setPlaying(false)}
        />
      </div>
    </div>
  );
}

export default AudioBottomSheet;
