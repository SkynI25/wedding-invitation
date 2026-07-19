import { useEffect, useRef } from "react"
import {
  BRIDE_FULLNAME,
  GROOM_FULLNAME,
  LOCATION,
  WEDDING_DATE,
  WEDDING_DATE_FORMAT,
} from "../../const"
import { COVER_IMAGE } from "../../images"
import { LazyDiv } from "../lazyDiv"

const DAY_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

// 하단 예식 정보가 들어갈 자리를 남기기 위해 이미지를 화면 높이의 이 비율만큼만 표시합니다.
const COVER_IMAGE_HEIGHT_RATIO = 0.82

/**
 * 초대장의 메인 커버 섹션입니다.
 * 예식 일시, 신랑/신부 이름, 장소를 표시합니다.
 *
 * @returns {JSX.Element} 커버 섹션
 */
export const Cover = () => {
  const imageWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 모바일 브라우저 주소창 접힘/펼침에 따라 뷰포트 높이가 변하면서
    // 이미지가 확대/축소되어 보이는 것을 막기 위해, 최초 마운트 시점의
    // 높이로 한 번만 고정합니다.
    if (imageWrapperRef.current) {
      imageWrapperRef.current.style.height = `${window.innerHeight * COVER_IMAGE_HEIGHT_RATIO}px`
    }
  }, [])

  return (
    <LazyDiv className="card cover">
      {/* 커버 이미지 (하단 예식 정보가 들어갈 자리만큼 잘라서 표시) */}
      <div className="image-wrapper" ref={imageWrapperRef}>
        <img src={COVER_IMAGE} alt="sample" />

        {/* 상단 오버레이: 날짜 및 요일 */}
        <div className="overlay overlay-top">
          <div className="wedding-date">
            {WEDDING_DATE.format("YYYY")}
            <div className="divider" />
            {WEDDING_DATE.format("MM")}
            <div className="divider" />
            {WEDDING_DATE.format("DD")}
          </div>
          <div className="wedding-day-of-week">
            {DAY_OF_WEEK[WEDDING_DATE.day()]}
          </div>
        </div>

        {/* 하단 오버레이: 부제 및 이름 */}
        <div className="overlay overlay-bottom">
          {/* <div className="subtitle">Save the date for the wedding of</div> */}
          <div className="names">
            {GROOM_FULLNAME}
            <div className="divider" />
            {BRIDE_FULLNAME}
          </div>
        </div>
      </div>

      {/* 이미지 아래 예식 정보 (일시/장소) */}
      <div className="cover-info">
        <div className="info">{WEDDING_DATE.format(WEDDING_DATE_FORMAT)}</div>
        <div className="info">{LOCATION}</div>
      </div>
    </LazyDiv>
  )
}
