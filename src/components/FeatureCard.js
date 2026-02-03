import { Link } from "react-router-dom";

const FeatureCard = ({ img, title, category }) => {
  return (
    <Link
      to={`/contents?category=${category}`}
      className="feature-card"
    >
      <span className={`category-chip ${category.toLowerCase()}`}>
        {category}
      </span>
      <img src={img} alt={title} />
      <div className="feature-card-title">{title}</div>
    </Link>
  );
};
export default FeatureCard;
