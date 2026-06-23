import { cn, getFormattedWaitTime } from "@/lib/utils";
import { Button } from "./ui/button";
import { CheckIcon, Loader2, MoveRight } from "lucide-react";
import type { RoomCardProps } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useEffect, useState } from "react";

const RoomCard = (props: RoomCardProps) => {
  const { queueId, name, doctorName, status, token } = props;

  const queryClient = useQueryClient();

  const [tokenDetails, setTokenDetails] = useState<{
    token: string;
    issuedAt: string;
    calledAt: string | null;
    completedAt: string | null;
    username: string;
  } | null>(null);

  const fetchTokenDetails = useMutation({
    mutationFn: (token: string) => {
      return api.getTokenDetails(token).catch((err) => console.error(err));
    },
    onSuccess: (data) => {
      if (data) {
        setTokenDetails(data.token);
      }
    },
    onError: (error) => {
      console.error("Error fetching token details:", error);
    },
  });

  const callNext = useMutation({
    mutationFn: (queueId: string) => {
      return api.callNext(queueId).catch((err) => console.error(err));
    },
    onSuccess: (data) => {
      if (data.queue && data.queue.token) {
        fetchTokenDetails.mutate(data.queue.token);
      }
      queryClient.invalidateQueries({ queryKey: ["queues"] });
      queryClient.invalidateQueries({ queryKey: ["tokens"] });
    },
    onError: (error) => {
      console.error("Error calling next:", error);
    },
  });

  const endCurrent = useMutation({
    mutationFn: (queueId: string) => {
      return api.endCurrent(queueId).catch((err) => console.error(err));
    },
    onSuccess: () => {
      setTokenDetails(null);
      queryClient.invalidateQueries({ queryKey: ["queues"] });
      queryClient.invalidateQueries({ queryKey: ["tokens"] });
    },
    onError: (error) => {
      console.error("Error ending current:", error);
    },
  });

  useEffect(() => {
    if (token) {
      fetchTokenDetails.mutate(token);
    }
  }, [token]);

  return (
    <div
      className={cn(
        "border rounded mt-2 overflow-hidden",
        status === "Available" && "border-green-400 dark:border-green-600",
      )}
    >
      <div
        className={cn(
          "flex justify-between items-center bg-background p-3",
          status === "Available" && "bg-green-100 dark:bg-green-900/20",
        )}
      >
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-muted-foreground">{name}</p>
          <p
            className={cn(
              "text-xs",
              status === "Available" && "text-green-700 dark:text-green-400",
            )}
          >
            {status}
          </p>
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          {doctorName}
        </p>
      </div>
      <div className="flex items-center justify-between p-3">
        <div className="">
          <p
            className={cn(
              "text-xl font-light font-mono",
              status === "Available" && "text-muted-foreground",
            )}
          >
            {token}
          </p>
          {token && (
            <p className="text-sm text-muted-foreground">
              {getFormattedWaitTime(tokenDetails?.calledAt)}
            </p>
          )}
        </div>
        {status === "Available" && (
          <Button
            variant="outline"
            disabled={callNext.isPending}
            onClick={() => callNext.mutate(queueId)}
          >
            {callNext.isPending && <Loader2 className="animate-spin" />}
            Call Next
            <MoveRight />
          </Button>
        )}
        {status === "Occupied" && (
          <Button
            variant="outline"
            disabled={endCurrent.isPending}
            onClick={() => endCurrent.mutate(queueId)}
          >
            {endCurrent.isPending && <Loader2 className="animate-spin" />}
            End Current
            <CheckIcon />
          </Button>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
