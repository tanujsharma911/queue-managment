import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="w-full min-h-screen">
      <div
        className="absolute top-0 left-0 w-full h-full -z-10 dark:invert"
        style={{
          backgroundImage: "url(bg.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <Outlet />
      <Toaster richColors position="bottom-right" />
    </div>
  );
}

export { App };
