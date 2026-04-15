import dynamic from "next/dynamic";

const HeroLeaderboard = dynamic(() => import("./HeroLeaderboard"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: "24px 0" }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            height: 200,
            background: "#111113",
            borderRadius: 16,
            marginBottom: 16,
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  ),
});

export default HeroLeaderboard;
