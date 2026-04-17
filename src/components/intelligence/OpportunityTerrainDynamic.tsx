import dynamic from "next/dynamic";
const OpportunityTerrain = dynamic(() => import("./OpportunityTerrain"), { ssr: false });
export default OpportunityTerrain;
