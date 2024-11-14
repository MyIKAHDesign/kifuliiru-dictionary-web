// src/app/categories/page.tsx
import { Metadata } from "next";
import { generateMetadata } from "../lib/metadata";
import CategoriesContent from "./CategoriesContent";

export const metadata: Metadata = generateMetadata({
  title: "Word Categories",
  description: "Explore Kifuliiru words organized by categories and themes",
  keywords: ["categories", "themes", "word groups"],
});

export default function Page() {
  return <CategoriesContent />;
}
