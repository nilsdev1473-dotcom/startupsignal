import dynamic from "next/dynamic";

const StatsStrip = dynamic(() => import("./StatsStrip"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12,
        marginBottom: 32,
      }}
    >
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            height: 80,
            background: "#111113",
            borderRadius: 12,
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  ),
});

export default StatsStrip;
