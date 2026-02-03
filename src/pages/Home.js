import { Link } from "react-router-dom";
import "../style/Home.css";

const FeatureCard = ({ img, title }) => (
  <div className="feature-card">
    <img src={img} alt={title} />
    <div className="feature-card-title">{title}</div>
  </div>
);

const Home = () => {
  const cards = [
    {
      img: "https://via.placeholder.com/300x400?text=Movie",
      title: "당신을 위한 영화 추천",
      category: "MOVIE",
    },
    {
      img: "https://via.placeholder.com/300x400?text=Book",
      title: "취향 저격 도서",
      category: "BOOK",
    },
    {
      img: "https://via.placeholder.com/300x400?text=Music",
      title: "오늘의 음악",
      category: "MUSIC",
    },
    {
      img: "https://via.placeholder.com/300x400?text=Movie+2",
      title: "이런 영화는 어때요?",
      category: "MOVIE",
    },
    {
      img: "https://via.placeholder.com/300x400?text=Book+2",
      title: "지금 많이 읽히는 책",
      category: "BOOK",
    },
  ];


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

      {/* Feature Section */}
      <section className="features-wrapper">
        <h2 className="section-title">AI가 분석한 당신의 취향</h2>

        <div className="features">
          {cards.map((card, idx) => (
            <FeatureCard key={idx} {...card} />
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
