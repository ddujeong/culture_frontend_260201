import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axiosConfig";
import "../style/ItemList.css";

const CATEGORY_LABELS = {
    MOVIE: "영화", DRAMA: "드라마", TV_SHOW: "예능/TV",
    ANIMATION: "애니메이션", BOOK: "도서/웹툰", MUSIC: "음악/앨범", ALL: "전체보기"
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
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams(); // 🌟 선언 순서 중요 (아래 searchInput 초기값에서 사용)

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // 🌟 입력창 로컬 상태: 주소창의 'search' 값을 초기값으로 사용
    const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

    const filter = {
        type: searchParams.get("type") || "ALL",
        category: searchParams.get("category") || "ALL",
        genre: searchParams.get("genre") || "ALL",
        search: searchParams.get("search") || "",
        sort: searchParams.get("sort") || "newest"
    };

    // 🌟 뒤로가기나 URL 직접 변경 시 입력창 동기화
    useEffect(() => {
        setSearchInput(searchParams.get("search") || "");
    }, [searchParams]);

    const updateFilter = (newParams) => {
        const updated = {
            type: filter.type,
            category: filter.category,
            genre: filter.genre,
            search: filter.search,
            sort: filter.sort,
            ...newParams
        };
        // 🌟 replace: true를 사용해야 검색어 입력 시 히스토리가 과하게 쌓이지 않음
        setSearchParams(updated, { replace: true });
    };

    useEffect(() => {
        setLoading(true);
        api.get(`/items`, { params: filter })
            .then((res) => {
                setItems(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [searchParams]);

    const handleTypeChange = (typeId) => updateFilter({ type: typeId, category: "ALL", genre: "ALL", search: "" });
    const handleCategoryChange = (catId) => updateFilter({ category: catId, genre: "ALL", search: "" });
    const handleGenreChange = (genreName) => updateFilter({ genre: genreName });
    const handleSortChange = (e) => updateFilter({ sort: e.target.value });

    // 🌟 입력 처리 (URL은 아직 안 바뀜)
    const handleSearchChange = (e) => setSearchInput(e.target.value);

    // 🌟 제출 처리 (URL 업데이트 -> API 호출)
    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            updateFilter({ search: searchInput });
        }
    };

    return (
        <div className="item-list-page">
            <aside className="item-list-sidebar">
                <div className="sidebar-sticky">
                    <h2 className="sidebar-title">콘텐츠 탐색</h2>
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

                    {filter.type !== "ALL" && (
                        <div className="filter-group anime-fade-in">
                            <div className="sidebar-divider" />
                            <p className="filter-label">세부 카테고리</p>
                            <nav className="category-nav">
                                <button
                                    className={`category-item sub ${filter.category === "ALL" ? "active" : ""}`}
                                    onClick={() => handleCategoryChange("ALL")}
                                >전체보기</button>
                                {Object.keys(FILTER_CONFIG[filter.type].categories).map((catId) => (
                                    <button
                                        key={catId}
                                        className={`category-item sub ${filter.category === catId ? "active" : ""}`}
                                        onClick={() => handleCategoryChange(catId)}
                                    >
                                        {CATEGORY_LABELS[catId] || catId}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    )}

                    {filter.category !== "ALL" && (
                        <div className="filter-group anime-fade-in">
                            <div className="sidebar-divider" />
                            <p className="filter-label">인기 장르</p>
                            <div className="genre-tag-container">
                                <button
                                    className={`genre-tag ${filter.genre === "ALL" ? "active" : ""}`}
                                    onClick={() => handleGenreChange("ALL")}
                                ># 전체</button>
                                {FILTER_CONFIG[filter.type].categories[filter.category].map((g) => (
                                    <button
                                        key={g}
                                        className={`genre-tag ${filter.genre === g ? "active" : ""}`}
                                        onClick={() => handleGenreChange(g)}
                                    ># {g}</button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            <main className="item-list-main">
                <header className="list-header">
                    <div className="header-left">
                        <h1>
                            {FILTER_CONFIG[filter.type].label}
                            {filter.category !== "ALL" && ` > ${CATEGORY_LABELS[filter.category]}`}
                        </h1>
                        <span className="item-count">총 {items.length}개</span>
                    </div>

                    <div className="header-right">
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="제목 검색 후 Enter..."
                                value={searchInput} // 🌟 filter.search 대신 searchInput 연결
                                onChange={handleSearchChange}
                                onKeyDown={handleSearchSubmit}
                            />
                            <span className="search-icon" onClick={() => updateFilter({ search: searchInput })}>🔍</span>
                        </div>
                        <select className="sort-select" value={filter.sort} onChange={handleSortChange}>
                            <option value="newest">최신등록순</option>
                            <option value="rating">별점높은순</option>
                            <option value="oldest">오래된순</option>
                        </select>
                    </div>
                </header>

                {filter.genre !== "ALL" && (
                    <div className="active-genre-info anime-fade-in">
                        선택된 장르: <strong>#{filter.genre}</strong>
                    </div>
                )}

                {loading ? (
                    <div className="loading-state"><div className="spinner"></div><p>데이터를 불러오는 중...</p></div>
                ) : (
                    <div className="items-grid">
                        {items.length > 0 ? items.map((item) => (
                            <div key={item.id} className="browse-card" onClick={() => navigate(`/items/${item.id}`)}>
                                <div className="card-img-wrapper">
                                    <img src={item.img || "/default-poster.png"} alt={item.title} />
                                    <div className="card-overlay"><span className="view-detail">상세보기</span></div>
                                </div>
                                <div className="card-body">
                                    <span className="card-genre">{item.genre}</span>
                                    <h4 className="card-title">{item.title}</h4>
                                </div>
                            </div>
                        )) : (
                            <div className="no-data-container">
                                <p>해당 조건에 맞는 콘텐츠가 없습니다. ✨</p>
                                <button onClick={() => setSearchParams({})} className="reset-filter-btn">필터 초기화</button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}