// components/skeletons/SpecializationSkeleton.jsx
import "../styles/specializationSkeleton.css";

const SpecializationSkeleton = ({ count = 12 }) => {
  return (
    <div className="specializations-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="spec-skeleton" />
      ))}
    </div>
  );
};

export default SpecializationSkeleton;
