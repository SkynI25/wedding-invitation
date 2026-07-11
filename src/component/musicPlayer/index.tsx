import { useEffect, useRef, useState } from "react"
import weddingAudio from "../../audio/wedding.m4a"
import MusicIcon from "../../icons/music-icon.svg?react"

/**
 * 배경음악 재생/일시정지 기능을 제공하는 플로팅 버튼 컴포넌트입니다.
 *
 * @returns {JSX.Element} 배경음악 컨트롤러
 */
export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // 대부분의 모바일/데스크톱 브라우저는 사용자 상호작용 없는 자동 재생을 차단하므로
    // 재생 실패 시 조용히 대기 상태(정지 아이콘)로 남겨둡니다.
    audio.play().then(
      () => setIsPlaying(true),
      () => setIsPlaying(false),
    )
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
    </>
  )
}
