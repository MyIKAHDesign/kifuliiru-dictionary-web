import { useRouter } from "next/navigation";
import {
  Users,
  Globe,
  ArrowRight,
  ChevronRight,
  UserPlus,
  Sparkles,
  BookOpenCheck,
  Globe2,
  GraduationCap,
  Heart,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

export default function ContributorInvitation() {
  const router = useRouter();

  const benefits = [
    {
      icon: Globe2,
      title: "Preserve Kifuliiru",
      description:
        "Help document and protect our language for future generations",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Users,
      title: "Build Community",
      description: "Connect with speakers and language enthusiasts worldwide",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Sparkles,
      title: "Earn Recognition",
      description: "Gain badges and acknowledgment for your contributions",
      color: "text-indigo-600 dark:text-indigo-400",
    },
    {
      icon: Heart,
      title: "Share Heritage",
      description: "Pass on cultural knowledge and traditions",
      color: "text-pink-600 dark:text-pink-400",
    },
  ];

  const viewerFeatures = [
    {
      icon: BookOpenCheck,
      title: "Full Dictionary Access",
      description: "Search and explore our comprehensive word collection",
    },
    {
      icon: GraduationCap,
      title: "Learning Resources",
      description: "Access language learning materials and guides",
    },
    {
      icon: Globe,
      title: "Cultural Content",
      description: "Discover rich cultural heritage and traditions",
    },
  ];

  const handlePathSelection = (path: "viewer" | "contributor") => {
    if (path === "viewer") {
      router.push("/dictionary");
    } else {
      router.push("/quiz");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
              Join Our Language Community
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose how you&apos;d like to engage with the Kifuliiru dictionary
              and community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="relative group overflow-hidden border-2 transition-all hover:border-purple-500/50 dark:hover:border-purple-400/50">
              <CardHeader>
                <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                  Become a Contributor
                </CardTitle>
                <CardDescription>
                  Join our mission to preserve and grow Kifuliiru language
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors"
                    >
                      <div className={`${benefit.color}`}>
                        <benefit.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePathSelection("contributor")}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 group"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Start Contributing</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </CardContent>
            </Card>

            <Card className="relative group overflow-hidden border-2 transition-all hover:border-gray-500/50 dark:hover:border-gray-400/50">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
                  Continue as Viewer
                </CardTitle>
                <CardDescription>
                  Explore and learn from our growing collection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  {viewerFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors"
                    >
                      <feature.icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    You can always choose to become a contributor later
                  </p>

                  <button
                    onClick={() => handlePathSelection("viewer")}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 group"
                  >
                    <span>Explore Dictionary</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
