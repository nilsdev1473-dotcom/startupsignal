"use client";

import dynamic from "next/dynamic";

const MarketHeatingChart = dynamic(() => import("./MarketHeatingChart"), {
  ssr: false,
});

export default MarketHeatingChart;
