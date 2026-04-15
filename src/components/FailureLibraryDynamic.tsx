import dynamic from "next/dynamic";
const FailureLibrary = dynamic(() => import("./FailureLibrary"), { ssr: false });
export default FailureLibrary;
