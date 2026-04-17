import dynamic from "next/dynamic";
const FailureTimeline = dynamic(() => import("./FailureTimeline"), { ssr: false });
export default FailureTimeline;
