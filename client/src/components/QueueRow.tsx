import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { toast } from "sonner";

const QueueRow = (props: {
  token: string;
  status: string;
  name: string;
  queueName?: string;
  arrivalTime: string;
}) => {
  const { token, status, name, queueName, arrivalTime } = props;

  const queryClient = useQueryClient();

  const deleteToken = useMutation({
    mutationFn: (queueId: string) => {
      return api.removeToken(queueId).catch((err) => console.error(err));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queues"] });
      queryClient.invalidateQueries({ queryKey: ["tokens"] });
      toast.success("Token removed successfully");
    },
  });

  return (
    <TableRow key={token}>
      <TableCell className="font-medium font-mono">{token}</TableCell>
      <TableCell>
        <Badge
          className={cn(
            status === "Waiting" &&
              "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
            status === "Called" &&
              "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
            status === "Completed" &&
              "bg-zinc-50 text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300",
          )}
        >
          {status}
        </Badge>
      </TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{queueName}</TableCell>
      <TableCell>{new Date(arrivalTime).toLocaleString()}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              variant="destructive"
              onClick={() => deleteToken.mutate(token)}
            >
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default QueueRow;
