// app/numbers/page.tsx
import { Suspense } from "react";
import { Metadata } from "next";
import { generateMetadata } from "../lib/metadata";
import NumbersContent from "./NumbersContent";
import { fetchNumbers } from "@/app/lib/supabase";

export const metadata: Metadata = generateMetadata({
  title: "Numbers in Kifuliiru",
  description:
    "Learn numbers from 1 to 100 in Kifuliiru with translations in multiple languages",
  keywords: ["kifuliiru numbers", "counting", "numerical system"],
});

export default async function Page() {
  const initialNumbers = await fetchNumbers();
  console.log("Fetched numbers count:", initialNumbers.length); // Debug log

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NumbersContent initialNumbers={initialNumbers} />
    </Suspense>
  );
}
