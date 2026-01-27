import "../styles/loader.css";

function Loader({ size = 48 }) {
  return (
    <div className="loader-wrapper">
      <span
        className="loader"
        style={{ width: size, height: size }}
      />
    </div>
  );
}

export default Loader;
