import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan Privasi Dorm Care — bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
