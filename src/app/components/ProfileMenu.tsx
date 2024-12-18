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
  role?: string;
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
    if (user?.role === "admin") {
      router.push("/admin");
    } else if (user?.role === "contributor") {
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
      <DropdownMenuContent className="w-56" align="end">
        <div className="flex items-center gap-2 p-2">
          <UserCircle className="h-4 w-4 opacity-70" />
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium">{user.full_name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDashboard}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          {user.role === "admin"
            ? "Admin Dashboard"
            : user.role === "contributor"
            ? "Contributor Dashboard"
            : "Dashboard"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-red-600 dark:text-red-400"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
