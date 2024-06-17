import Hero from "@/components/hero";
import { redirect, RedirectType } from "next/navigation";

export default function Home() {

  return redirect("https://otopio.net", RedirectType.replace);
}
