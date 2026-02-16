import { Link } from "react-router-dom";
import "../style/Home.css";
import api from "../api/axiosConfig";
import { useEffect, useState } from "react";

const FeatureCard = ({ img, title }) => (
  <div className="feature-card">
    <img src={img} alt={title} />
    <div className="feature-card-title">{title}</div>
  </div>
);

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [books, setBooks] = useState([]);
  const [music, setMusic] = useState([]);

  useEffect(() => {
    // 로그인 여부에 관계없이 호출 가능!
    // 로그인 안 했다면 userId 파라미터가 빠진 채로 가거나 null로 전송됨
    api.get("/recommendations/home")
      .then(res => {
        // res.data.movies, res.data.books 등을 처리
        setMovies(res.data.movie?.items || []);
        setBooks(res.data.book?.items || []);
        setMusic(res.data.music?.items || []);
        console.log(res.data)
      })
      .catch(err => console.error("추천 데이터 로딩 실패:", err));
  }, []);

  // 두 데이터를 합쳐서 화면에 뿌려줄 배열 만들기

  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <h1>
          당신의 취향을 분석하는
          <br />
          문화 추천 서비스
        </h1>
        <p>
          영화, 책, 음악까지.
          <br />
          AI가 당신의 선택과 기록을 바탕으로
          <br />
          꼭 맞는 콘텐츠를 추천합니다.
        </p>

        <div>
          <Link to="/login">취향 분석 시작하기</Link>
          <Link to="/signup">회원가입</Link>
        </div>
      </section>

      {/* 🎬 1. Movie Section - 와이드한 포스터 느낌 */}
      <section className="home-section movie-bg">
        <div className="section-info">
          <h2>🎥 지금 가장 핫한 영화</h2>
          <Link to="/contents?category=MOVIE" className="view-all">모두 보기</Link>
        </div>
        <div className="content-grid">
          {movies.slice(0, 4).map((item) => (
            <div key={item.id} className="item-card movie-card">
              <img src={item.img} alt={item.title} />
              <div className="card-overlay">
                <span className="genre-tag">{item.genre}</span>
                <h3>{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 📚 2. Book Section - 정갈한 책장 느낌 */}
      <section className="home-section">
        <div className="section-info">
          <h2>📖 AI 추천 도서</h2>
          <Link to="/contents?category=BOOK" className="view-all">모두 보기</Link>
        </div>
        <div className="content-grid">
          {books.slice(0, 4).map((item) => (
            <div key={item.id} className="item-card book-card">
              <div className="book-cover-wrapper">
                <img src={item.img} alt={item.title} />
              </div>
              <div className="item-info">
                <h4>{item.title}</h4>
                <p>{item.genre}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🎧 3. Music Section - 앨범 아트 그리드 느낌 */}
      <section className="home-section music-dark">
        <div className="section-info">
          <h2>🎧 오늘의 추천 음악</h2>
          <Link to="/contents?category=MUSIC" className="view-all">모두 보기</Link>
        </div>

        {/* music-grid 클래스를 사용하여 150px씩 작게 배치 */}
        <div className="music-grid">
          {music.slice(0, 6).map((item) => (
            <div key={item.id} className="item-card music-card">
              <div className="music-img-wrapper">
                <img src={item.img} alt={item.title} />
                {/* 호버했을 때 나타날 플레이 버튼 (선택사항) */}
                <div className="play-overlay">▶</div>
              </div>
              <div className="item-details">
                {/* 제목 - 아티스트 분리 출력 */}
                <h4>{item.title.split(' - ')[0]}</h4>
                <p>{item.title.split(' - ')[1] || item.genre}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>기록할수록 더 정확해지는 추천</h2>
        <p>
          별점과 한 줄 코멘트만 남겨도
          <br />
          AI가 당신의 취향을 학습합니다.
        </p>
        <Link to="/login">추천 받아보기</Link>
      </section>
    </main>
  );
};

export default Home;
