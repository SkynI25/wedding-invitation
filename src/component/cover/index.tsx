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

/**
 * 초대장의 메인 커버 섹션입니다.
 * 예식 일시, 신랑/신부 이름, 장소를 표시합니다.
 *
 * @returns {JSX.Element} 커버 섹션
 */
export const Cover = () => {
  return (
    <LazyDiv className="card cover">
      {/* 커버 이미지 (전체 화면을 채우고 텍스트가 그 위에 오버레이됨) */}
      <div className="image-wrapper">
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

        {/* 하단 오버레이: 이름 및 예식 정보 */}
        <div className="overlay overlay-bottom">
          <div className="subtitle">Save the date for the wedding of</div>
          <div className="names">
            {GROOM_FULLNAME}
            <div className="divider" />
            {BRIDE_FULLNAME}
          </div>
          <div className="info">{WEDDING_DATE.format(WEDDING_DATE_FORMAT)}</div>
          <div className="info">{LOCATION}</div>
        </div>
      </div>
    </LazyDiv>
  )
}
