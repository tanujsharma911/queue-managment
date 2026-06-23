import Navbar from "@/components/Navbar";
import { Logs, User } from "lucide-react";
import { Link } from "react-router";

const Home = () => {
  return (
    <div className="text-center">
      <Navbar noLogout />
      <h1 className="mt-40 scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance dark:text-white">
        We Believe an a Better Customer and Provider Experience.
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 px-4 max-w-200 mx-auto mt-10">
        <Link
          to="/client"
          className="py-10 flex flex-col items-center bg-white dark:bg-zinc-900 border border-purple-500 rounded transition-all hover:outline-2 outline-purple-100 dark:outline-purple-700"
        >
          <Logs className="size-10 text-purple-500 mb-2" />
          <p>View Your Token</p>
          <p className="text-xs text-muted-foreground font-medium">
            View queues you are part of
          </p>
        </Link>
        <Link
          to="/queues"
          className="py-10 flex flex-col items-center bg-white dark:bg-zinc-900 border border-purple-500 rounded transition-all hover:outline-2 outline-purple-100 dark:outline-purple-700"
        >
          <Logs className="size-10 text-purple-500 mb-2" />
          <p>Waiting Room Display</p>
          <p className="text-xs text-muted-foreground font-medium">
            View list of queues
          </p>
        </Link>
        <Link
          to="/login"
          className="py-10 flex flex-col items-center bg-white dark:bg-zinc-900 border border-purple-500 rounded transition-all hover:outline-2 outline-purple-100 dark:outline-purple-700"
        >
          <User className="size-10 text-purple-500 mb-2" />
          <p>Receptionist</p>
          <p className="text-xs text-muted-foreground font-medium">
            Manage receptionist tasks
          </p>
        </Link>
      </div>
    </div>
  );
};

export { Home };
