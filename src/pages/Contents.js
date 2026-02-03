import FeatureCard from "../components/FeatureCard";
import "../style/Contents.css";

const Contents = () => {
  const movieList = [
    { img: "https://via.placeholder.com/240x360", title: "인셉션", category: "MOVIE" },
    { img: "https://via.placeholder.com/240x360", title: "인터스텔라", category: "MOVIE" },
  ];

  const bookList = [
    { img: "https://via.placeholder.com/240x360", title: "아몬드", category: "BOOK" },
    { img: "https://via.placeholder.com/240x360", title: "데미안", category: "BOOK" },
  ];

  const musicList = [
    { img: "https://via.placeholder.com/240x240", title: "Lauv - Paris", category: "MUSIC" },
    { img: "https://via.placeholder.com/240x240", title: "IU - Love poem", category: "MUSIC" },
  ];

  return (
    <main className="contents-page">
      <h1 className="contents-title">AI가 추천한 콘텐츠</h1>

      <section className="content-section">
        <h2>MOVIE</h2>
        <div className="content-row">
          {movieList.map((item, idx) => (
            <FeatureCard key={idx} {...item} />
          ))}
        </div>
      </section>

      <section className="content-section">
        <h2>BOOK</h2>
        <div className="content-row">
          {bookList.map((item, idx) => (
            <FeatureCard key={idx} {...item} />
          ))}
        </div>
      </section>

      <section className="content-section">
        <h2>MUSIC</h2>
        <div className="content-row">
          {musicList.map((item, idx) => (
            <FeatureCard key={idx} {...item} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Contents;
