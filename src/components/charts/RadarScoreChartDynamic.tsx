"use client";

import dynamic from "next/dynamic";

const RadarScoreChart = dynamic(() => import("./RadarScoreChart"), {
  ssr: false,
});

export default RadarScoreChart;
