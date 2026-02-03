import { useParams } from "react-router-dom";
import { useState } from "react";
import "../style/ContentDetail.css";

const ContentDetail = () => {
  const { category, id } = useParams();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <main className="detail-page">
      <section className="detail-top">
        <img
          className="detail-image"
          src="https://via.placeholder.com/300x420"
          alt="content"
        />

        <div className="detail-info">
          <span className={`detail-category ${category}`}>
            {category.toUpperCase()}
          </span>

          <h1 className="detail-title">콘텐츠 제목 예시</h1>

          <div className="detail-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={rating >= star ? "star active" : "star"}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            className="detail-comment"
            placeholder="한 줄 코멘트를 남겨주세요"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button className="save-btn">기록 저장</button>
        </div>
      </section>

      <section className="ai-preview">
        <h2>AI 취향 분석</h2>
        <p>
          사용자의 평가를 기반으로 감성, 분위기, 장르 선호도를 분석하여
          추천 정확도를 높입니다.
        </p>
      </section>
    </main>
  );
};

export default ContentDetail;
