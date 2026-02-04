// ItemDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../style/ItemDetail.css";
import { useUser } from "../context/UserContext";
// ItemDetail.jsx 상단에 추가
const StarRating = ({ rating, setRating }) => {
  return (
    <div className="star-rating">
      {Array.from({ length: 5 }).map((_, idx) => (
        <span
          key={idx}
          className={idx < rating ? "active" : ""}
          onMouseEnter={() => setRating(idx + 1)}
          onClick={() => setRating(idx + 1)}
        >
          ★
        </span>
      ))}
    </div>
  );
};


export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    api
      .get(`/items/${id}`)
      .then((res) => setItem(res.data))
      .catch((err) => {
        console.error(err);
        alert("아이템 정보를 불러오지 못했습니다.");
        navigate(-1);
      });
  }, [id, navigate]);

  const fetchReviews = () => {
    api.get(`/reviews/item/${id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchReviews(); }, [id]);

  // 3️⃣ 리뷰 작성
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("로그인 후 작성 가능합니다.");

    try {
      await api.post(`/reviews`, {
        userId: user.id,
        itemId: item.id,
        rating: newReview.rating,
        comment: newReview.comment
      });
      setNewReview({ rating: 5, comment: "" });
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert("리뷰 작성 실패");
    }
  };
  if (!item) return <p>로딩 중...</p>;

  // 별점 시각화
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < Math.round(item.averageRating) ? "★" : "☆"
  );

  return (
    <div className="item-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← 뒤로가기
      </button>

      <div className="item-detail-card">
        <img
          src={item.img || "https://via.placeholder.com/300x400"}
          alt={item.title}
          className="item-detail-img"
        />
        <div className="item-detail-info">
          <h1>{item.title}</h1>
          <p>
            <strong>장르:</strong> {item.genre} |{" "}
            <strong>개봉년도:</strong> {item.releaseDate?.slice(0, 4) || "정보 없음"}
          </p>
          <p className="item-description">{item.description || "설명 없음"}</p>

          <div className="rating">
            <strong>평점:</strong> {stars.join(" ")} ({item.averageRating.toFixed(1)})
          </div>

          <div className="otts">
            <strong>시청 가능 OTT:</strong>
            <div className="ott-buttons">
              {item.otts.map((ott, idx) => (
                <a
                  key={idx}
                  href={ott.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ott-btn"
                  style={{ backgroundColor: ott.color }}
                >
                  <img src={ott.logoUrl} alt={ott.name} />
                  {ott.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* 리뷰 섹션 */}
      <section className="reviews-section">
        {/* 리뷰 작성 폼 */}
        {user && (
          <form className="review-form" onSubmit={handleSubmitReview}>
            <h3>리뷰 작성</h3>
            <label>
              평점:
              <StarRating rating={newReview.rating} setRating={(rate) =>
                setNewReview({ ...newReview, rating: rate })
              } />
            </label>
            <label>
              코멘트:
              <input
                type="text"
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                required
              />
            </label>
            <button type="submit">작성</button>
          </form>
        )}
        <h2>리뷰 ({reviews.length})</h2>
        <ul className="reviews-list">
          {reviews.map((r) => (
            <li
              key={r.id}
              className={user && r.userId === user.id ? "my-review" : ""}
            >
              <strong>{r.username}</strong> ({r.rating}/5): {r.comment}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
