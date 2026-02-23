import { Link, useNavigate } from "react-router-dom";
import "../style/Home.css";
import api from "../api/axiosConfig";
import { useEffect, useState } from "react";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [dramas, setDramas] = useState([]); // 📺 드라마 상태 추가
  const [entertainment, setentertainment] = useState([]);
  const [animations, setAnimations] = useState([]);
  const [books, setBooks] = useState([]);
  const [music, setMusic] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/recommendations/home")
      .then(res => {
        // 백엔드 API 설계에 따라 res.data.movie, res.data.drama 등으로 매핑
        setMovies(res.data.movie?.items || []);
        setDramas(res.data.drama?.items || []);
        setAnimations(res.data.animation?.items || []);
        setentertainment(res.data.entertainment?.items || [])
        setBooks(res.data.book?.items || []);
        setMusic(res.data.music?.items || []);
        console.log(res.data)
      })
      .catch(err => console.error("데이터 로딩 실패:", err));
  }, []);

  return (
    <div className="home-simple">
      {/* 01. Hero: 시각적으로 압도하는 첫 화면 */}
      <header className="simple-hero">
        <div className="hero-content">
          <span className="trending-tag">New Perspective</span>
          <h1>당신의 기록, <br /> 하나의 취향이 되다.</h1>
          <p>영화, 도서, 음악까지 당신만을 위한 큐레이션</p>
          <div className="hero-btns">
            <Link to="/login" className="main-btn shadow">지금 시작하기</Link>
          </div>
        </div>
      </header>

      <div className="home-body">
        {/* 02. Movie Section: 최근 개봉 영화 */}
        <section className="simple-section">
          <div className="container">
            <div className="section-head">
              <h2>🎬 최근 개봉 영화</h2>
              <Link to="/list?type=VIDEO&category=MOVIE" className="more-link">전체보기</Link>
            </div>
            <div className="horizontal-list">
              {movies.length > 0 ? movies.map(item => (
                <div key={item.id} className="simple-card" onClick={() => navigate(`/items/${item.itemId}`)}>
                  <div className="img-box">
                    <img src={item.img} alt={item.title} />
                    <div className="rank-badge new">New</div>
                  </div>
                  <div className="info-box">
                    <h3>{item.title}</h3>
                    <span>{item.genre}</span>
                  </div>
                </div>
              )) : <div className="loading-placeholder">데이터를 불러오는 중입니다...</div>}
            </div>
          </div>
        </section>

        {/* 03. Drama Section: 화제의 드라마 */}
        <section className="simple-section">
          <div className="container">
            <div className="section-head">
              <h2>📺 화제의 드라마 & 시리즈</h2>
              <Link to="/list?type=VIDEO&category=DRAMA" className="more-link">전체보기</Link>
            </div>
            <div className="horizontal-list">
              {dramas.length > 0 ? dramas.map(item => (
                <div key={item.id} className="simple-card" onClick={() => navigate(`/items/${item.itemId}`)}>
                  <div className="img-box">
                    <img src={item.img} alt={item.title} />
                    <div className="rank-badge hot">Hot</div>
                  </div>
                  <div className="info-box">
                    <h3>{item.title}</h3>
                    <span>{item.genre}</span>
                  </div>
                </div>
              )) : <div className="loading-placeholder">데이터를 불러오는 중입니다...</div>}
            </div>
          </div>
        </section>
        <section className="simple-section">
          <div className="container">
            <div className="section-head">
              <h2>📺 인기 예능 </h2>
              <Link to="/list?type=VIDEO&category=DRAMA" className="more-link">전체보기</Link>
            </div>
            <div className="horizontal-list">
              {entertainment.length > 0 ? entertainment.map(item => (
                <div key={item.id} className="simple-card" onClick={() => navigate(`/items/${item.itemId}`)}>
                  <div className="img-box">
                    <img src={item.img} alt={item.title} />
                    <div className="rank-badge hot">Hot</div>
                  </div>
                  <div className="info-box">
                    <h3>{item.title}</h3>
                    <span>{item.genre}</span>
                  </div>
                </div>
              )) : <div className="loading-placeholder">데이터를 불러오는 중입니다...</div>}
            </div>
          </div>
        </section>

        {/* 03. Drama Section: 화제의 드라마 */}
        <section className="simple-section">
          <div className="container">
            <div className="section-head">
              <h2>📺 인기 애니</h2>
              <Link to="/list?type=VIDEO&category=DRAMA" className="more-link">전체보기</Link>
            </div>
            <div className="horizontal-list">
              {animations.length > 0 ? animations.map(item => (
                <div key={item.id} className="simple-card" onClick={() => navigate(`/items/${item.itemId}`)}>
                  <div className="img-box">
                    <img src={item.img} alt={item.title} />
                    <div className="rank-badge hot">Hot</div>
                  </div>
                  <div className="info-box">
                    <h3>{item.title}</h3>
                    <span>{item.genre}</span>
                  </div>
                </div>
              )) : <div className="loading-placeholder">데이터를 불러오는 중입니다...</div>}
            </div>
          </div>
        </section>
        {/* 04. Book & Music: 하단 정렬 */}
        <section className="simple-section gray-bg">
          <div className="container split-view">

            {/* 도서 영역 */}
            <div className="list-group">
              <div className="section-head mini">
                <h2>📖 베스트셀러 도서</h2>
              </div>
              <div className="row-list">
                {books.slice(0, 4).map(item => (
                  <div key={item.id} className="row-item" onClick={() => navigate(`/items/${item.itemId}`)}>
                    <img src={item.img} alt={item.title} className="row-img-book" />
                    <div className="row-info">
                      <h4>{item.title}</h4>
                      <p>{item.genre}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 음악 영역 (다시 1열 리스트로 하되, 훨씬 컴팩트하게) */}
            <div className="list-group">
              <div className="section-head mini">
                <h2>🎧 인기 음악</h2>
              </div>
              <div className="music-slim-list">
                {music.slice(0, 5).map(item => (
                  <div key={item.id} className="music-slim-item" onClick={() => navigate(`/items/${item.itemId}`)}>
                    <img src={item.img} alt={item.title} className="slim-thumb" />
                    <div className="slim-info">
                      <h4>{item.title.split(' - ')[0]}</h4>
                      <p>{item.title.split(' - ')[1] || item.genre}</p>
                    </div>
                    <div className="slim-play">▶</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;