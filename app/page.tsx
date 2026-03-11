import dynamic from "next/dynamic";

const SkiMap = dynamic(() => import("./components/SkiMap"), { ssr: false });

export default function Home() {
  return <SkiMap />;
}
