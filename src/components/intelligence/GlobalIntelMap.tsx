"use client";

import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup, type GeoFeature } from "react-simple-maps";

type FilterType = "vc" | "market" | "talent" | "regulatory";

interface CityData {
  name: string;
  coordinates: [number, number];
  score: number;
  detail: string;
}

interface Props {
  selectedCategory: string | null;
  pinnedIdea?: string | null;
}

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// VC density scores per country ISO (A3) for each category
const COUNTRY_SCORES: Record<string, Record<string, number>> = {
  AI: { USA: 100, GBR: 82, CHN: 78, ISR: 74, DEU: 68, SGP: 65, CAN: 62, FRA: 60, IND: 55, KOR: 52 },
  Fintech: { USA: 100, GBR: 90, SGP: 85, ARE: 70, BRA: 65, DEU: 60, NLD: 58, AUS: 55, IND: 52, CHE: 50 },
  Defense: { USA: 100, ISR: 90, GBR: 80, SWE: 70, AUS: 65, DEU: 60, FRA: 58, NOR: 55, POL: 45, EST: 40 },
  Biotech: { USA: 100, CHE: 88, GBR: 82, DEU: 75, SGP: 70, DNK: 68, SWE: 65, FRA: 60, ISR: 58, JPN: 55 },
  ClimaTech: { USA: 90, DEU: 88, GBR: 82, NLD: 78, DNK: 75, SWE: 72, AUS: 65, NOR: 68, CAN: 60, FRA: 58 },
  DevTools: { USA: 95, DEU: 80, NLD: 75, GBR: 72, CAN: 68, AUS: 65, FRA: 60, IND: 58, BRA: 50, CZE: 48 },
  Healthtech: { USA: 95, GBR: 82, SWE: 78, DEU: 75, ISR: 70, SGP: 68, AUS: 62, NLD: 60, CHE: 58, DNK: 55 },
  Robotics: { USA: 95, JPN: 88, DEU: 82, CHN: 78, KOR: 75, GBR: 65, FRA: 60, CHE: 58, ITA: 52, SWE: 50 },
  Space: { USA: 100, LUX: 82, GBR: 70, ARE: 68, NZL: 62, DEU: 58, FRA: 55, AUS: 52, IND: 50, JPN: 48 },
  Marketplace: { USA: 90, GBR: 85, DEU: 78, SGP: 75, AUS: 68, BRA: 65, IND: 62, FRA: 58, NLD: 55, CAN: 52 },
  Other: { USA: 75, GBR: 65, DEU: 60, SGP: 55, CAN: 52, AUS: 50, FRA: 48, IND: 45, BRA: 42, NLD: 40 },
};

// Market size scores (user/customer base)
const MARKET_SCORES: Record<string, Record<string, number>> = {
  AI: { USA: 100, CHN: 95, IND: 85, GBR: 70, DEU: 65, JPN: 60, BRA: 55, FRA: 52 },
  Fintech: { USA: 100, IND: 92, CHN: 88, BRA: 80, NGA: 72, IDN: 70, GBR: 65, DEU: 60 },
  Defense: { USA: 100, RUS: 85, CHN: 82, DEU: 70, GBR: 68, FRA: 65, IND: 62, ISR: 72 },
  Biotech: { USA: 100, CHN: 78, JPN: 72, DEU: 68, GBR: 65, FRA: 60, IND: 55, KOR: 52 },
  ClimaTech: { USA: 90, CHN: 85, DEU: 78, IND: 72, GBR: 68, JPN: 65, AUS: 60, FRA: 58 },
  DevTools: { USA: 95, IND: 88, CHN: 80, GBR: 72, DEU: 68, BRA: 62, FRA: 58, UKR: 55 },
  Healthtech: { USA: 100, CHN: 88, IND: 80, DEU: 72, GBR: 70, JPN: 68, BRA: 62, FRA: 58 },
  Robotics: { USA: 95, CHN: 90, JPN: 88, DEU: 80, KOR: 75, GBR: 65, FRA: 60, ITA: 58 },
  Space: { USA: 100, CHN: 85, EU: 70, IND: 65, ARE: 60, JPN: 58, AUS: 52, NZL: 48 },
  Marketplace: { USA: 95, CHN: 90, IND: 85, BRA: 78, IDN: 72, GBR: 68, DEU: 65, NGA: 62 },
  Other: { USA: 80, CHN: 75, IND: 70, GBR: 60, DEU: 58, BRA: 55, JPN: 52, FRA: 50 },
};

const CITY_DATA: Record<string, CityData[]> = {
  AI: [
    { name: "San Francisco", coordinates: [-122.4, 37.8], score: 100, detail: "OpenAI, Anthropic, Google DeepMind HQ" },
    { name: "London", coordinates: [-0.1, 51.5], score: 85, detail: "DeepMind, Stability AI, £2.5B AI investment" },
    { name: "Beijing", coordinates: [116.4, 39.9], score: 80, detail: "Baidu, ByteDance, $15B govt AI fund" },
    { name: "Tel Aviv", coordinates: [34.8, 32.1], score: 74, detail: "#3 AI patents/capita globally" },
    { name: "Berlin", coordinates: [13.4, 52.5], score: 68, detail: "Aleph Alpha, robust AI talent pool" },
  ],
  Fintech: [
    { name: "New York", coordinates: [-74.0, 40.7], score: 100, detail: "Stripe, Plaid, $18B VC in 2024" },
    { name: "London", coordinates: [-0.1, 51.5], score: 90, detail: "Revolut, Wise, FCA sandbox" },
    { name: "Singapore", coordinates: [103.8, 1.4], score: 85, detail: "MAS crypto-friendly, ASEAN gateway" },
    { name: "Dubai", coordinates: [55.3, 25.2], score: 70, detail: "DIFC, zero tax, 450+ fintechs" },
    { name: "São Paulo", coordinates: [-46.6, -23.5], score: 65, detail: "Nubank HQ, 200M+ unbanked opportunity" },
  ],
  Defense: [
    { name: "Washington DC", coordinates: [-77.0, 38.9], score: 100, detail: "DoD, DARPA, $850B defense budget" },
    { name: "Tel Aviv", coordinates: [34.8, 32.1], score: 90, detail: "Unit 8200 alumni, Elbit, Rafael" },
    { name: "London", coordinates: [-0.1, 51.5], score: 80, detail: "DSTL, MOD, NATO command" },
    { name: "Stockholm", coordinates: [18.1, 59.3], score: 70, detail: "Saab, NATO member, defense exports" },
    { name: "Sydney", coordinates: [151.2, -33.9], score: 62, detail: "AUKUS, $20B defense modernization" },
  ],
  Biotech: [
    { name: "Boston", coordinates: [-71.1, 42.4], score: 100, detail: "Kendall Sq, Moderna, $8B VC" },
    { name: "San Francisco", coordinates: [-122.4, 37.8], score: 95, detail: "Genentech origin, UCSF, $6B VC" },
    { name: "Basel", coordinates: [7.6, 47.6], score: 88, detail: "Novartis, Roche, pharma cluster" },
    { name: "Singapore", coordinates: [103.8, 1.4], score: 75, detail: "Biopolis, A*STAR, APAC hub" },
    { name: "London", coordinates: [-0.1, 51.5], score: 70, detail: "Wellcome Trust, Francis Crick Institute" },
  ],
  ClimaTech: [
    { name: "San Francisco", coordinates: [-122.4, 37.8], score: 90, detail: "Breakthrough Energy, Khosla, $4B VC" },
    { name: "Berlin", coordinates: [13.4, 52.5], score: 88, detail: "EU Green Deal HQ, €100B investment" },
    { name: "London", coordinates: [-0.1, 51.5], score: 82, detail: "COP host, green finance leader" },
    { name: "Amsterdam", coordinates: [4.9, 52.4], score: 78, detail: "Energy transition hub, circular economy" },
    { name: "Copenhagen", coordinates: [12.6, 55.7], score: 75, detail: "Orsted, CIP, wind energy capital" },
  ],
  DevTools: [
    { name: "San Francisco", coordinates: [-122.4, 37.8], score: 95, detail: "GitHub, Vercel, Stripe, seed capital" },
    { name: "Berlin", coordinates: [13.4, 52.5], score: 80, detail: "Strong OSS culture, lower burn rate" },
    { name: "Amsterdam", coordinates: [4.9, 52.4], score: 75, detail: "Adyen, Booking, EU dev hub" },
    { name: "London", coordinates: [-0.1, 51.5], score: 72, detail: "Monzo, Deliveroo tech, talent pool" },
    { name: "Bangalore", coordinates: [77.6, 12.9], score: 68, detail: "Largest dev workforce globally" },
  ],
  Healthtech: [
    { name: "Boston", coordinates: [-71.1, 42.4], score: 90, detail: "MGH, Brigham, $5B healthtech VC" },
    { name: "San Francisco", coordinates: [-122.4, 37.8], score: 85, detail: "UCSF, One Medical, Ro" },
    { name: "London", coordinates: [-0.1, 51.5], score: 80, detail: "NHS sandbox, Babylon, Doctorly" },
    { name: "Stockholm", coordinates: [18.1, 59.3], score: 75, detail: "Kry, Nordic Digital Health" },
    { name: "Singapore", coordinates: [103.8, 1.4], score: 68, detail: "APAC digital health gateway" },
  ],
  Robotics: [
    { name: "Boston", coordinates: [-71.1, 42.4], score: 95, detail: "Boston Dynamics, iRobot, MIT CSAIL" },
    { name: "San Francisco", coordinates: [-122.4, 37.8], score: 90, detail: "Figure AI, Agility, OpenAI robotics" },
    { name: "Tokyo", coordinates: [139.7, 35.7], score: 88, detail: "Honda, Toyota, AIST research" },
    { name: "Munich", coordinates: [11.6, 48.1], score: 80, detail: "BMW, Siemens, TU Munich" },
    { name: "Shenzhen", coordinates: [114.1, 22.5], score: 75, detail: "DJI, manufacturing robotics cluster" },
  ],
  Space: [
    { name: "Cape Canaveral", coordinates: [-80.7, 28.4], score: 100, detail: "SpaceX, NASA, launch infrastructure" },
    { name: "Luxembourg City", coordinates: [6.1, 49.6], score: 82, detail: "Space Resources Law, SES, €200M fund" },
    { name: "London", coordinates: [-0.1, 51.5], score: 70, detail: "Satellite Applications Catapult" },
    { name: "Dubai", coordinates: [55.3, 25.2], score: 68, detail: "UAE Space Agency, Mars mission" },
    { name: "Auckland", coordinates: [174.8, -36.9], score: 62, detail: "Rocket Lab HQ, orbital launch site" },
  ],
  Marketplace: [
    { name: "New York", coordinates: [-74.0, 40.7], score: 90, detail: "Airbnb, Etsy, largest B2C market" },
    { name: "London", coordinates: [-0.1, 51.5], score: 85, detail: "Depop, Cazoo, EU access point" },
    { name: "Berlin", coordinates: [13.4, 52.5], score: 78, detail: "Zalando, HelloFresh origin" },
    { name: "Singapore", coordinates: [103.8, 1.4], score: 75, detail: "Shopee, Lazada, ASEAN gateway" },
    { name: "São Paulo", coordinates: [-46.6, -23.5], score: 65, detail: "MercadoLibre, 200M+ consumers" },
  ],
  Other: [
    { name: "San Francisco", coordinates: [-122.4, 37.8], score: 80, detail: "Global startup hub" },
    { name: "London", coordinates: [-0.1, 51.5], score: 72, detail: "Europe tech capital" },
    { name: "Berlin", coordinates: [13.4, 52.5], score: 65, detail: "EU startup ecosystem" },
    { name: "Singapore", coordinates: [103.8, 1.4], score: 60, detail: "APAC hub" },
    { name: "New York", coordinates: [-74.0, 40.7], score: 70, detail: "East coast tech scene" },
  ],
};

function getScoreForFilter(cat: string, countryISO: string, filter: FilterType): number {
  const map = filter === "vc" ? COUNTRY_SCORES : filter === "market" ? MARKET_SCORES : COUNTRY_SCORES;
  return (map[cat] ?? map["Other"] ?? {})[countryISO] ?? 0;
}

function scoreToFill(score: number): string {
  if (score >= 80) return "rgba(239,68,68,0.55)";
  if (score >= 60) return "rgba(245,158,11,0.45)";
  if (score >= 40) return "rgba(16,185,129,0.35)";
  if (score >= 15) return "rgba(0,212,255,0.2)";
  return "rgba(13,27,62,0.6)";
}

const FILTER_LABELS: Record<FilterType, string> = {
  vc: "VC DENSITY",
  market: "MARKET SIZE",
  talent: "TALENT POOL",
  regulatory: "REG. CLIMATE",
};

export default function GlobalIntelMap({ selectedCategory, pinnedIdea }: Props) {
  const [filter, setFilter] = useState<FilterType>("vc");
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const [pulse, setPulse] = useState(0);

  const cat = selectedCategory ?? "AI";
  const cities = CITY_DATA[cat] ?? CITY_DATA["Other"];

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => (p + 1) % 100), 50);
    return () => clearInterval(interval);
  }, []);

  const pulseScale = 1 + Math.sin((pulse / 100) * Math.PI * 2) * 0.4;

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
        <div>
          <div className="text-[9px] font-bold tracking-widest uppercase" style={{ color: "rgba(0,212,255,0.7)", fontFamily: "monospace" }}>
            GLOBAL INTEL MAP
          </div>
          <div className="text-[8px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
            {cat.toUpperCase()} SECTOR · {cities.length} HUB CITIES
            {pinnedIdea && <span style={{ color: "rgba(245,158,11,0.8)" }}> · 📍 {pinnedIdea.slice(0, 20)}</span>}
          </div>
        </div>
        {/* Filter pills */}
        <div className="flex gap-1">
          {(Object.keys(FILTER_LABELS) as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="text-[8px] px-2 py-0.5 rounded transition-all"
              style={{
                fontFamily: "monospace",
                background: filter === f ? "rgba(0,212,255,0.15)" : "rgba(255,255,255,0.03)",
                color: filter === f ? "rgba(0,212,255,0.9)" : "rgba(255,255,255,0.3)",
                border: `1px solid ${filter === f ? "rgba(0,212,255,0.4)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative overflow-hidden">
        <ComposableMap
          projection="geoNaturalEarth1"
          style={{ width: "100%", height: "100%" }}
          projectionConfig={{ scale: 140 }}
        >
          <ZoomableGroup center={[10, 20]} zoom={1}>
            <Geographies geography={GEO_URL}>
              {({ geographies }: { geographies: GeoFeature[] }) =>
                geographies.map((geo: GeoFeature) => {
                  const iso = geo.properties["ISO_A3"] as string;
                  const score = getScoreForFilter(cat, iso, filter);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={scoreToFill(score)}
                      stroke="rgba(0,212,255,0.18)"
                      strokeWidth={0.4}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: score > 0 ? "rgba(0,212,255,0.35)" : "rgba(255,255,255,0.08)", outline: "none", cursor: "pointer" },
                        pressed: { outline: "none" },
                      }}
                      onMouseEnter={(e: React.MouseEvent) => {
                        if (score > 0) {
                          setTooltip({
                            x: e.clientX,
                            y: e.clientY,
                            text: `${geo.properties["NAME"] as string} · Score: ${score}`,
                          });
                        }
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })
              }
            </Geographies>

            {/* City markers */}
            {cities.map((city) => (
              <Marker key={city.name} coordinates={city.coordinates}>
                {/* Outer pulse ring */}
                <circle
                  r={8 * pulseScale}
                  fill="none"
                  stroke="rgba(0,212,255,0.15)"
                  strokeWidth={1}
                />
                {/* Mid ring */}
                <circle
                  r={5}
                  fill="none"
                  stroke="rgba(0,212,255,0.35)"
                  strokeWidth={0.8}
                />
                {/* Core dot */}
                <circle
                  r={3}
                  fill={city.score >= 90 ? "#EF4444" : city.score >= 70 ? "#F59E0B" : "#10B981"}
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth={0.5}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e: React.MouseEvent) =>
                    setTooltip({ x: e.clientX, y: e.clientY, text: `${city.name} · ${city.detail}` })
                  }
                  onMouseLeave={() => setTooltip(null)}
                />
                {/* City label */}
                <text
                  textAnchor="middle"
                  y={-10}
                  style={{
                    fontSize: 7,
                    fill: "rgba(0,212,255,0.8)",
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    pointerEvents: "none",
                  }}
                >
                  {city.name.toUpperCase()}
                </text>
                {/* Score badge */}
                <text
                  textAnchor="middle"
                  y={-3}
                  style={{
                    fontSize: 6,
                    fill: "rgba(255,255,255,0.5)",
                    fontFamily: "monospace",
                    pointerEvents: "none",
                  }}
                >
                  {city.score}
                </text>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {/* CRT scanlines overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
          }}
        />

        {/* Corner decorations */}
        {[
          "absolute top-0 left-0 w-6 h-6 border-t border-l",
          "absolute top-0 right-0 w-6 h-6 border-t border-r",
          "absolute bottom-0 left-0 w-6 h-6 border-b border-l",
          "absolute bottom-0 right-0 w-6 h-6 border-b border-r",
        ].map((cls, i) => (
          <div key={i} className={cls} style={{ borderColor: "rgba(0,212,255,0.3)" }} />
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none px-2 py-1 rounded text-[9px]"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 8,
            background: "rgba(5,5,7,0.95)",
            border: "1px solid rgba(0,212,255,0.3)",
            color: "rgba(255,255,255,0.85)",
            fontFamily: "monospace",
            maxWidth: 220,
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
