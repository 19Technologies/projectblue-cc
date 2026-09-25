import { Welcome } from "@/components/Welcome";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Start a room",
  description: "Open a Project Blue room and share the six-character code.",
};

export default function StartPage() {
  return <Welcome />;
}
