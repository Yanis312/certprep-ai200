import { getModules, summarize } from "@/lib/course";
import HomeClient from "@/components/HomeClient";

export default function Home() {
  return <HomeClient modules={getModules().map(summarize)} />;
}
