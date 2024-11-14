import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import {
  History,
  Users,
  MapPin,
  Languages,
  Mountain,
  Waves,
  TreePine,
  Music,
  Crown,
  Brush,
  BookOpen,
  Home,
  Wheat,
  Heart,
  Leaf,
  Calendar,
  Baby,
  Utensils,
  Users2,
  LucideIcon,
} from "lucide-react";
import { FeatureGrid } from "./components/FeatureGrid";
import { TimelineSection } from "./components/TimelineSection";
import { FactsDisplay } from "./components/FactsDisplay";

// Type definitions
interface Fact {
  label: string;
  value: string;
  icon: LucideIcon;
}

interface TimelineEvent {
  year: string;
  event: string;
  description?: string;
}

interface CulturalFeature {
  title: string;
  description: string;
  icon: LucideIcon;
}

// Data definitions
const historicalFacts: Fact[] = [
  { label: "Population", value: "500,000+", icon: Users },
  { label: "Region", value: "South Kivu, DRC", icon: MapPin },
  { label: "Primary Language", value: "Kifuliiru", icon: Languages },
  { label: "Major Centers", value: "Uvira, Lemera, Luvungi", icon: Home },
  { label: "Traditional Chiefs", value: "12 Historical", icon: Crown },
  { label: "Age of Culture", value: "500+ Years", icon: History },
  { label: "Clan Groups", value: "24 Major Clans", icon: Users2 },
  { label: "Sacred Sites", value: "15+ Locations", icon: Mountain },
];

const timeline: TimelineEvent[] = [
  {
    year: "Pre-1700s",
    event: "Early Migration Period",
    description:
      "Migration of Abafuliiru ancestors to the South Kivu region, establishing first settlements along fertile valleys",
  },
  {
    year: "1700-1800",
    event: "Kingdom Formation",
    description:
      "Development of traditional chiefdoms and establishment of the council of elders system",
  },
  {
    year: "1800-1850",
    event: "Cultural Golden Age",
    description:
      "Flourishing of traditional arts, music, and agricultural practices. Development of unique farming techniques",
  },
  {
    year: "1850-1900",
    event: "Pre-Colonial Era",
    description:
      "Strengthening of inter-community trade networks and diplomatic relations with neighboring peoples",
  },
  {
    year: "1900-1960",
    event: "Colonial Period",
    description:
      "Preservation of cultural identity while adapting to new administrative structures",
  },
  {
    year: "1960-2000",
    event: "Independence Era",
    description:
      "Revival of traditional institutions and adaptation to modern governance",
  },
  {
    year: "2000-Present",
    event: "Modern Renaissance",
    description:
      "Digital preservation of culture and global diaspora connections",
  },
];

const culturalFeatures: CulturalFeature[] = [
  {
    title: "Musical Heritage",
    description:
      "Complex drumming patterns, ceremonial songs, and dance traditions including the sacred 'Mutanga' dance",
    icon: Music,
  },
  {
    title: "Life Ceremonies",
    description:
      "Elaborate birth, coming-of-age, marriage, and ancestral honor ceremonies",
    icon: Heart,
  },
  {
    title: "Traditional Crafts",
    description:
      "Distinctive pottery, beadwork, woodcarving, and textile weaving techniques",
    icon: Brush,
  },
  {
    title: "Oral Wisdom",
    description:
      "Rich collection of proverbs, riddles, and historical narratives passed through generations",
    icon: BookOpen,
  },
  {
    title: "Agricultural Rituals",
    description:
      "Seasonal ceremonies for planting and harvest, including the important 'Masabo' festival",
    icon: Wheat,
  },
  {
    title: "Traditional Medicine",
    description:
      "Ancient healing practices using local herbs and spiritual healing ceremonies",
    icon: Leaf,
  },
];

const traditionalPractices: CulturalFeature[] = [
  {
    title: "Agricultural Calendar",
    description:
      "Complex farming system based on lunar cycles and seasonal changes",
    icon: Calendar,
  },
  {
    title: "Naming Ceremonies",
    description:
      "Elaborate naming traditions connecting newborns to ancestors and natural phenomena",
    icon: Baby,
  },
  {
    title: "Culinary Heritage",
    description:
      "Distinctive cooking methods and traditional dishes for different occasions",
    icon: Utensils,
  },
  {
    title: "Community Justice",
    description: "Traditional conflict resolution and peace-making ceremonies",
    icon: Users,
  },
];

const geographicFeatures: CulturalFeature[] = [
  {
    title: "Sacred Mountains",
    description: "Including Mount Mitumba and historical ritual sites",
    icon: Mountain,
  },
  {
    title: "River Valleys",
    description: "The life-giving Ruzizi River and its tributaries",
    icon: Waves,
  },
  {
    title: "Forest Sanctuaries",
    description:
      "Ancient forest groves with medicinal plants and spiritual significance",
    icon: TreePine,
  },
  {
    title: "Agricultural Lands",
    description: "Terraced hillsides and fertile valley farming systems",
    icon: Wheat,
  },
];

export default function AbafuliiruContent() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 z-50"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <section className="relative h-[80vh] bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl text-white"
          >
            <h1 className="text-6xl font-bold mb-6">The Abafuliiru Legacy</h1>
            <p className="text-xl mb-8">
              Discover the rich cultural heritage of over half a million people,
              preserving centuries of wisdom and tradition in the heart of
              Africa.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm"
            >
              Explore Our Heritage
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <Tabs defaultValue="culture" className="space-y-8">
          <TabsList className="flex flex-wrap gap-2">
            {["culture", "history", "geography", "practices"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="px-4 py-2 rounded-lg capitalize"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="culture">
            <Card>
              <CardHeader>
                <CardTitle>Cultural Heritage</CardTitle>
                <CardDescription>
                  Exploring the rich traditions that define the Abafuliiru
                  people
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FeatureGrid features={culturalFeatures} columns={3} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Historical Facts</CardTitle>
                <CardDescription>
                  Key figures and statistics about the Abafuliiru people
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FactsDisplay facts={historicalFacts} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historical Timeline</CardTitle>
                <CardDescription>
                  Journey through the ages of Abafuliiru history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TimelineSection events={timeline} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geography">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Heritage</CardTitle>
                <CardDescription>
                  The sacred lands and natural features of Abafuliiru territory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FeatureGrid features={geographicFeatures} columns={2} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practices">
            <Card>
              <CardHeader>
                <CardTitle>Traditional Practices</CardTitle>
                <CardDescription>
                  Ancient customs and rituals that continue to shape daily life
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FeatureGrid features={traditionalPractices} columns={2} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
