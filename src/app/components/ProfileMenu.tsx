// components/ProfileMenu.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Cloud,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
  BookMarked,
  BookPlus,
  History,
} from "lucide-react";

import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";

interface UserProfile {
  id: string;
  avatar_url?: string;
  full_name?: string;
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

  if (!user) return null;

  const getRoleColor = (role?: string) => {
    const colors: Record<string, string> = {
      super_admin: "bg-red-500",
      admin: "bg-purple-500",
      editor: "bg-blue-500",
      viewer: "bg-green-500",
    };
    return colors[role?.toLowerCase() || ""] || "bg-gray-500";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 rounded-full ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-indigo-500">
            <AvatarImage
              src={user.avatar_url || ""}
              alt={user.full_name || ""}
            />
            <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
              {getInitials(user.full_name || "U")}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-900" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar_url || ""} />
                <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                  {getInitials(user.full_name || "U")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.full_name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
                <Badge
                  variant="secondary"
                  className={`mt-1 ${getRoleColor(user.role)} text-white`}
                >
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <BookMarked className="mr-2 h-4 w-4" />
            <span>My dashboard</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <BookMarked className="mr-2 h-4 w-4" />
            <span>Saved Words</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <History className="mr-2 h-4 w-4" />
            <span>History</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {(user.role === "editor" ||
          user.role === "admin" ||
          user.role === "super_admin") && (
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <BookPlus className="mr-2 h-4 w-4" />
              <span>Add New Word</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>My Contributions</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuGroup>
        )}
        {(user.role === "admin" || user.role === "super_admin") && (
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              <span>Team</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Invite users</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Email</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Message</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>More...</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
          </DropdownMenuGroup>
        )}
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Cloud className="mr-2 h-4 w-4" />
            <span>API</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 dark:text-red-400"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileMenu;
