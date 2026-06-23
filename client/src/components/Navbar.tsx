import { MonitorCog, Moon, Settings, SunDim } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "@/services/api";
import { getStoredTheme, setTheme } from "@/lib/theme";

const Navbar = ({ noLogout }: { noLogout?: boolean }) => {
  const navigate = useNavigate();

  const [themeChoice, setThemeChoice] = useState<"light" | "dark" | "system">(
    () => {
      const stored = getStoredTheme();
      return (stored as any) ?? "system";
    },
  );

  useEffect(() => {
    // ensure applied on mount in case main didn't run or theme changed elsewhere
    setTheme(themeChoice);
  }, [themeChoice]);

  const handleLogout = async () => {
    window.localStorage.removeItem("token");
    navigate("/login");
    await api.logout().catch((err) => console.error(err));
  };

  return (
    <div className="bg-zinc-100 dark:bg-zinc-950 px-4 h-10 flex items-center justify-between">
      <Link to="/" className="font-bold">
        Queue Management
      </Link>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={themeChoice}
                onValueChange={(v) => setThemeChoice(v as any)}
              >
                <DropdownMenuRadioItem value="light">
                  <SunDim />
                  Light Mode
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <Moon />
                  Dark Mode
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  <MonitorCog />
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
            {!noLogout && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
