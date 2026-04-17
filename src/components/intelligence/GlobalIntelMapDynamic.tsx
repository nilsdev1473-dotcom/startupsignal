import dynamic from "next/dynamic";
const GlobalIntelMap = dynamic(() => import("./GlobalIntelMap"), { ssr: false });
export default GlobalIntelMap;
