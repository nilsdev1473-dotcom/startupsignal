import dynamic from "next/dynamic";
const IdeasDatabase = dynamic(() => import("./IdeasDatabase"), { ssr: false });
export default IdeasDatabase;
