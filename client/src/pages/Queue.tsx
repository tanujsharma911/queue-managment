import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";
import type { QueueType } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { io } from "socket.io-client";

const Queues = () => {
  const navigate = useNavigate();

  const timerRef = useRef<number | null>(null);

  const [isCursorVisible, setIsCursorVisible] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [rooms, setRooms] = useState<QueueType[]>([]);

  const handleMouseMove = () => {
    setIsCursorVisible(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsCursorVisible(false);
    }, 2500);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      navigate("/");
    }
  };

  const getQueueData = async () => {
    const response = await api.getQueues();
    setRooms(response.queues);
  };

  useEffect(() => {
    document.title = "Queues | Queue Cure";

    window.addEventListener("keydown", handleKeyDown);

    const socket = io("http://localhost:3000", {
      autoConnect: true,
      withCredentials: true,
    });

    socket.connect();

    socket.on("connect", () => {
      setIsConnected(true);

      getQueueData();
    });

    socket.on("queueUpdated", (data) => {
      setRooms(data.queues);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      socket.disconnect();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div
      className="border h-screen flex items-center flex-col bg-background text-foreground"
      style={{ cursor: isCursorVisible ? "default" : "none" }}
      onMouseMove={handleMouseMove}
    >
      {isCursorVisible && (
        <div className="absolute p-3 flex items-center gap-4">
          <Button variant={"outline"} onClick={() => navigate("/")}>
            Back
            <Kbd>Esc</Kbd>
          </Button>
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
            </p>
          </div>
        </div>
      )}
      <div className="max-w-300 w-full m-auto">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          Waiting Room
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 mt-10">
          {rooms.map((room) => {
            return (
              <div
                key={room.queueId}
                className="border border-border bg-card dark:bg-zinc-900 rounded-lg shadow-sm overflow-hidden"
              >
                <p className="bg-purple-100 text-center p-2 font-bold text-2xl text-foreground dark:bg-purple-950/60">
                  {room.queueName}
                </p>
                <p
                  className={cn(
                    "text-6xl text-center my-8 text-foreground",
                    room.status === "Available" &&
                      "text-muted-foreground dark:text-zinc-400",
                  )}
                >
                  {room.token}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { Queues };
