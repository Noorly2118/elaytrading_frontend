const StatsCard = ({ title, value }) => {
  return (
    <div className="col-md-3 mb-3">
      <div
        className="card shadow-sm p-3"
        style={{
          border: "none",
          borderRadius: "12px",
          transition: "transform 0.2s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      >
        <h6 className="text-muted mb-2" style={{ fontSize: "13px" }}>
          {title}
        </h6>
        <h3 className="mb-0" style={{ color: "#01446F", fontWeight: "bold" }}>
          {value}
        </h3>
      </div>
    </div>
  );
};

export default StatsCard;