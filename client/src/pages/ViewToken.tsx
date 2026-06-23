import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";
import type { TokenDetailsType } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  DoorOpen,
  ListOrdered,
  Loader2,
  MoveLeft,
  Timer,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { io } from "socket.io-client";
import { Skeleton } from "@/components/ui/skeleton";

const ViewToken = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [token, setToken] = useState(
    window.localStorage.getItem("token") || "",
  );
  const [isConnected, setIsConnected] = useState(false);

  const {
    isPending: tokenDataPending,
    // error: tokenDataError,
    data: tokenData,
  } = useQuery({
    queryKey: ["token"],
    queryFn: () =>
      api
        .getTokenDetails(token)
        .then((res) => ((res.token || null) as TokenDetailsType) || null)
        .catch((err) => console.error(err)),
  });

  const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
    window.localStorage.setItem("token", e.target.value);
  };

  const handleGetTokenDetails = async () => {
    if (token.trim() === "") {
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["token"] });
  };

  useEffect(() => {
    document.title = "View Token | Queue Cure";

    const storedToken = window.localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      queryClient.invalidateQueries({ queryKey: ["token"] });
    }

    const socket = io("http://localhost:3000", {
      autoConnect: true,
      withCredentials: true,
    });

    socket.connect();

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("queueUpdated", (data) => {
      console.log("Queue updated:", data);

      if (token) {
        queryClient.invalidateQueries({ queryKey: ["token"] });
      }
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar noLogout />
      <div className="max-w-100 mx-auto w-full mt-10">
        <Button
          variant={"outline"}
          className="mx-4 md:mx-0"
          onClick={() => navigate("/")}
        >
          <MoveLeft className=" text-muted-foreground" />
          Back to Home
        </Button>
      </div>
      <div className="pt-15 mx-4">
        <h1 className="text-center text-4xl font-extrabold tracking-tight text-balance">
          My Token
        </h1>

        <div className="flex flex-col items-center mt-10 max-w-100 mx-auto">
          <Field>
            <FieldLabel htmlFor="token">Type Your Token</FieldLabel>
            <Input
              id="token"
              type="text"
              placeholder="Eg. T0034"
              value={token}
              onChange={handleOnInputChange}
            />
          </Field>
          <Button
            className="mt-4 w-full py-4"
            onClick={handleGetTokenDetails}
            disabled={tokenDataPending}
          >
            {tokenDataPending && <Loader2 className="animate-spin" />}
            View Token
          </Button>
        </div>
        {tokenData && (
          <div className="flex flex-col items-center mt-10 max-w-100 mx-auto w-full">
            <div className="flex gap-2 items-center justify-between w-full">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Token Details
              </h3>
              <p className="text-muted-foreground text-xs">
                {isConnected ? "🟢 Viewing Live Data" : "🔴 Disconnected"}
              </p>
            </div>

            <div className="mt-4 w-full rounded-2xl border border-border bg-card shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
              <div className="flex gap-2 p-2 px-3 text-lg justify-between items-center">
                <div className="flex items-center gap-2">
                  <DoorOpen className="w-5 text-muted-foreground" />{" "}
                  {tokenData?.queueName}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground text-sm">
                    Currently In Room:
                  </p>
                  <span className="font-mono">
                    {tokenData?.tokenInRoom || "None"}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="p-2 px-3">
                <div className="mt-2">
                  <p className="text-muted-foreground">Your Token</p>
                  <div className="font-mono text-3xl flex justify-between">
                    {tokenData?.token}{" "}
                    <Badge
                      className={cn(
                        "border ml-2",
                        tokenData?.status === "Waiting" &&
                          "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border-orange-300",
                        tokenData?.status === "Called" &&
                          "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-300",
                        tokenData?.status === "Completed" &&
                          "bg-zinc-50 text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 border-zinc-300",
                      )}
                    >
                      {tokenData?.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                    <Timer className="w-4" />
                    Est. Wait Time:{" "}
                    {`~${Math.round(tokenData.estimatedWaitTime / 1000 / 60)} min`}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                    <ListOrdered className="w-4" />
                    Position in Queue: {tokenData?.positionInQueue}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                    <Calendar className="w-4" />
                    Issued At:
                    {new Date(tokenData?.issuedAt || "").toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tokenDataPending && (
          <div className="flex flex-col items-center mt-10 max-w-100 mx-auto w-full">
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        )}
      </div>
    </div>
  );
};

export { ViewToken };
