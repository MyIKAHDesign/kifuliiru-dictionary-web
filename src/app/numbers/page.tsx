import { Metadata } from "next";
import { generateMetadata } from "../lib/metadata";
import NumbersPage from "./NumbersContent";

export const metadata: Metadata = generateMetadata({
  title: "Numbers in Kifuliiru",
  description:
    "Learn numbers from 1 to 100 in Kifuliiru with translations in multiple languages",
  keywords: ["kifuliiru numbers", "counting", "numerical system"],
});

export default function Page() {
  return <NumbersPage />;
}
