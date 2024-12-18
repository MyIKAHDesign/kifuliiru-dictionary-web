import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { LogOut, UserCircle, LayoutDashboard, Settings } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";

interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  role?: "super_admin" | "admin" | "editor" | "viewer";
  email?: string;
}

export function ProfileMenu() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setUser({
          id: session.user.id,
          avatar_url: profile?.avatar_url,
          full_name: profile?.full_name || session.user.email?.split("@")[0],
          role: profile?.role,
          email: session.user.email,
        });
      }
    }

    fetchProfile();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const handleDashboard = () => {
    if (user?.role === "super_admin") {
      router.push("/admin");
    } else if (user?.role === "editor") {
      router.push("/contribute");
    } else {
      router.push("/dashboard");
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.avatar_url || ""}
              alt={user.full_name || ""}
            />
            <AvatarFallback className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300">
              {getInitials(user.full_name || "U")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg"
        align="end"
      >
        <div className="flex items-center gap-2 p-3 bg-orange-50/50 dark:bg-orange-900/20 rounded-t-md">
          <UserCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {user.full_name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
        <DropdownMenuItem
          onClick={handleDashboard}
          className="p-3 focus:bg-gray-100 dark:focus:bg-gray-700"
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          {user.role === "super_admin"
            ? "Admin Dashboard"
            : user.role === "editor"
            ? "Contributor Dashboard"
            : "Dashboard"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/settings")}
          className="p-3 focus:bg-gray-100 dark:focus:bg-gray-700"
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="p-3 text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
