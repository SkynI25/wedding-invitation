import { useEffect, useRef, useState } from "react"
import weddingAudio from "../../audio/wedding.mp3"
import MusicIcon from "../../icons/music-icon.svg?react"

const WELCOME_LINES = ["Welcome to", "to our wedding"]
// 한 글자씩 나타나는 애니메이션이 끝까지 보이도록 웰컴 화면의 최소 노출 시간을 확보합니다.
const WELCOME_MIN_DURATION = 1800

// 두 줄에 걸쳐 순서대로 나타나도록, 줄이 바뀌어도 글자 지연시간이 이어지게 미리 계산해둡니다.
const WELCOME_LINE_CHARS = (() => {
  let index = 0
  return WELCOME_LINES.map((line) =>
    [...line].map((char) => ({ char, index: index++ })),
  )
})()

/**
 * 배경음악 재생/일시정지 기능을 제공하는 플로팅 버튼 컴포넌트입니다.
 *
 * @returns {JSX.Element} 배경음악 컨트롤러
 */
export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMinTimeElapsed, setIsMinTimeElapsed] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const attemptPlay = () => {
      audio.play().then(
        () => {
          setIsPlaying(true)
          cleanupUnlockListeners()
        },
        () => setIsPlaying(false),
      )
    }

    // 대부분의 모바일/데스크톱 브라우저는 사용자 상호작용 없는 자동 재생을 차단하므로,
    // 차단된 경우 화면에 처음 손을 대는 순간(클릭/터치/키 입력) 재생을 시도합니다.
    const unlockEvents: (keyof DocumentEventMap)[] = [
      "click",
      "touchstart",
      "keydown",
    ]
    const cleanupUnlockListeners = () => {
      unlockEvents.forEach((event) =>
        document.removeEventListener(event, attemptPlay),
      )
    }
    unlockEvents.forEach((event) =>
      document.addEventListener(event, attemptPlay, { passive: true }),
    )

    attemptPlay()

    return cleanupUnlockListeners
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const markLoaded = () => setIsLoaded(true)
    audio.addEventListener("canplaythrough", markLoaded)
    audio.addEventListener("error", markLoaded)
    // 모바일 브라우저는 사용자 상호작용 전까지 오디오 리소스를 미리 불러오지 않을 수 있어,
    // 웰컴 화면이 무한정 떠 있지 않도록 최대 대기 시간을 둡니다.
    const fallbackTimer = setTimeout(markLoaded, 4000)

    return () => {
      audio.removeEventListener("canplaythrough", markLoaded)
      audio.removeEventListener("error", markLoaded)
      clearTimeout(fallbackTimer)
    }
  }, [])

  useEffect(() => {
    const minTimeTimer = setTimeout(
      () => setIsMinTimeElapsed(true),
      WELCOME_MIN_DURATION,
    )
    return () => clearTimeout(minTimeTimer)
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(
        () => setIsPlaying(true),
        () => setIsPlaying(false),
      )
    }
  }

  return (
    <>
      <audio ref={audioRef} src={weddingAudio} loop />
      <button
        className={`music-player${isPlaying ? " playing" : ""}`}
        onClick={toggle}
        aria-label={isPlaying ? "배경음악 일시정지" : "배경음악 재생"}
      >
        <MusicIcon className="icon" />
      </button>

      {/* 배경음악 로딩이 끝날 때까지 보여주는 웰컴 화면 */}
      <div
        className={`welcome-overlay${isLoaded && isMinTimeElapsed ? " faded" : ""}`}
        aria-hidden={isLoaded && isMinTimeElapsed}
      >
        <div className="welcome-text" aria-label={WELCOME_LINES.join(" ")}>
          {WELCOME_LINE_CHARS.map((line, lineIdx) => (
            <div className="welcome-line" key={lineIdx}>
              {line.map(({ char, index }, idx) => (
                <span
                  key={idx}
                  className="char"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {char === " " ? " " : char}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
