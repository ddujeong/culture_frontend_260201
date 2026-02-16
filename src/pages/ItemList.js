import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../style/ItemList.css";

// 🌟 카테고리 영문명을 한글로 보여주기 위한 매퍼
const CATEGORY_LABELS = {
    MOVIE: "영화",
    DRAMA: "드라마",
    TV_SHOW: "예능/TV",
    ANIMATION: "애니메이션",
    BOOK: "도서/웹툰",
    MUSIC: "음악/앨범",
    ALL: "전체보기"
};

const FILTER_CONFIG = {
    ALL: { label: "🏠 전체보기", categories: {} },
    VIDEO: {
        label: "🎬 영상",
        categories: {
            MOVIE: ["액션", "코미디", "SF", "범죄", "로맨스", "드라마", "미스터리", "애니메이션", "기타"],
            DRAMA: ["드라마", "판타지", "코미디", "범죄", "액션", "미스터리", "기타"],
            TV_SHOW: ["리얼리티", "토크쇼", "코미디", "게임"],
            ANIMATION: ["애니메이션", "판타지", "가족", "액션"]
        }
    },
    STATIC: {
        label: "🎵 정적 콘텐츠",
        categories: {
            BOOK: ["판타지", "문학", "자기계발", "만화", "경제경영", "사회과학", "수필", "인문학", "유아", "외국어", "과학", "수험서", "SF", "역사"],
            MUSIC: ["K-POP", "R&B", "POP", "BALLAD", "HIP-HOP", "ROCK", "EDM"]
        }
    }
};

export default function ItemList() {
    const [filter, setFilter] = useState({ type: "ALL", category: "ALL", genre: "ALL" });
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        api.get(`/items`, {
            params: {
                type: filter.type,
                category: filter.category,
                genre: filter.genre
            }
        })
            .then((res) => {
                setItems(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [filter]);

    const handleTypeChange = (typeId) => {
        setFilter({ type: typeId, category: "ALL", genre: "ALL" });
    };

    const handleCategoryChange = (catId) => {
        setFilter(prev => ({ ...prev, category: catId, genre: "ALL" }));
    };

    const handleGenreChange = (genreName) => {
        setFilter(prev => ({ ...prev, genre: genreName }));
    };

    return (
        <div className="item-list-page">
            <aside className="item-list-sidebar">
                <div className="sidebar-sticky">
                    <h2 className="sidebar-title">콘텐츠 탐색</h2>

                    {/* 1단계: 유형(Type) */}
                    <div className="filter-group">
                        <p className="filter-label">유형</p>
                        <nav className="category-nav">
                            {Object.keys(FILTER_CONFIG).map((typeId) => (
                                <button
                                    key={typeId}
                                    className={`category-item ${filter.type === typeId ? "active" : ""}`}
                                    onClick={() => handleTypeChange(typeId)}
                                >
                                    {FILTER_CONFIG[typeId].label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* 2단계: 카테고리(Category) */}
                    {filter.type !== "ALL" && (
                        <>
                            <div className="sidebar-divider" />
                            <div className="filter-group anime-fade-in">
                                <p className="filter-label">세부 카테고리</p>
                                <nav className="category-nav">
                                    <button
                                        className={`category-item sub ${filter.category === "ALL" ? "active" : ""}`}
                                        onClick={() => handleCategoryChange("ALL")}
                                    >
                                        전체보기
                                    </button>
                                    {Object.keys(FILTER_CONFIG[filter.type].categories).map((catId) => (
                                        <button
                                            key={catId}
                                            className={`category-item sub ${filter.category === catId ? "active" : ""}`}
                                            onClick={() => handleCategoryChange(catId)}
                                        >
                                            {/* 🌟 매퍼를 사용하여 한글로 출력 */}
                                            {CATEGORY_LABELS[catId] || catId}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </>
                    )}

                    {/* 3단계: 장르(Genre) */}
                    {filter.category !== "ALL" && (
                        <>
                            <div className="sidebar-divider" />
                            <div className="filter-group anime-fade-in">
                                <p className="filter-label">인기 장르</p>
                                <div className="genre-tag-container">
                                    <button
                                        className={`genre-tag ${filter.genre === "ALL" ? "active" : ""}`}
                                        onClick={() => handleGenreChange("ALL")}
                                    >
                                        # 전체
                                    </button>
                                    {FILTER_CONFIG[filter.type].categories[filter.category].map((g) => (
                                        <button
                                            key={g}
                                            className={`genre-tag ${filter.genre === g ? "active" : ""}`}
                                            onClick={() => handleGenreChange(g)}
                                        >
                                            # {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </aside>

            <main className="item-list-main">
                <header className="list-header">
                    <h1>
                        {FILTER_CONFIG[filter.type].label}
                        {filter.category !== "ALL" && ` > ${CATEGORY_LABELS[filter.category]}`}
                        {filter.genre !== "ALL" && <span className="genre-title"> #{filter.genre}</span>}
                    </h1>
                    <span className="item-count">총 {items.length}개</span>
                </header>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>데이터를 불러오는 중...</p>
                    </div>
                ) : (
                    <div className="items-grid">
                        {items.length > 0 ? items.map((item) => (
                            <div key={item.id} className="browse-card" onClick={() => navigate(`/items/${item.id}`)}>
                                <div className="card-img-wrapper">
                                    <img src={item.img || "/default-poster.png"} alt={item.title} />
                                    <div className="card-overlay">
                                        <span className="view-detail">상세보기</span>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <span className="card-genre">{item.genre}</span>
                                    <h4 className="card-title">{item.title}</h4>
                                </div>
                            </div>
                        )) : (
                            <div className="no-data-container">
                                <p>해당 조건에 맞는 콘텐츠가 없습니다. ✨</p>
                                <button onClick={() => setFilter({ type: "ALL", category: "ALL", genre: "ALL" })} className="reset-filter-btn">
                                    필터 초기화
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}