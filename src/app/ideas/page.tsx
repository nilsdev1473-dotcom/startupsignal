"use client";
import IdeasDatabase from "@/components/IdeasDatabase";
export default function IdeasPage() {
  return (
    <div
      className="min-h-screen px-4 py-6 sm:px-6 sm:py-8"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      <h1
        className="text-xl sm:text-2xl font-semibold mb-6"
        style={{ color: "rgba(255,255,255,0.95)" }}
      >
        Ideas Database
      </h1>
      <IdeasDatabase />
    </div>
  );
}
