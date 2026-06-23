import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { QueueType } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AddTokenCard = (props: { queues: QueueType[] | undefined | void }) => {
  const { queues } = props;

  const queryClient = useQueryClient();

  const [selectedQueue, setSelectedQueue] = useState<string>("");
  const [username, setName] = useState<string>("");

  const [nameError, setNameError] = useState<string>("");

  const deleteToken = async (token: string) => {
    try {
      await api.removeToken(token);
      queryClient.invalidateQueries({ queryKey: ["tokens"] });
      toast.success("Token deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error(
        `Failed to delete token: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  };

  const addToken = useMutation({
    mutationFn: ({
      queueId,
      username,
    }: {
      queueId: string;
      username: string;
    }) => {
      if (!username.trim()) {
        setNameError("Username is required");
        return Promise.reject(new Error("Username is required"));
      }
      setNameError("");
      setName("");
      return api.addToken(queueId, username).catch((err) => console.error(err));
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tokens"] });

      toast.success("Token added successfully", {
        action: {
          label: "Undo",
          onClick: () => deleteToken(data.token.token),
        },
      });
    },
    onError: (error) => {
      toast.error(
        `Failed to add token: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    },
  });

  useEffect(() => {
    if (queues && queues.length > 0) {
      setSelectedQueue(queues[0].queueId);
    }
  }, [queues]);

  return (
    <section className="bg-card col-span-3 rounded p-3">
      <h3 className="scroll-m-20 mb-4 text-xl font-semibold tracking-tight">
        Add to Queue
      </h3>
      <FieldSet>
        <Field>
          <FieldLabel htmlFor="form-name">Full Name</FieldLabel>
          <Input
            id="form-name"
            placeholder="Full Name"
            value={username}
            onChange={(e) => {
              setName(e.target.value);
              setNameError("");
            }}
            aria-invalid={!!nameError}
          />
          {nameError && <FieldDescription>{nameError}</FieldDescription>}
        </Field>
        <Field>
          <FieldLabel htmlFor="form-area">Area</FieldLabel>
          <Select
            value={selectedQueue}
            onValueChange={(value) => setSelectedQueue(value)}
          >
            <SelectTrigger id="form-area">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {!!queues &&
                queues.map((queue) => (
                  <SelectItem key={queue.queueId} value={queue.queueId}>
                    {queue.queueName}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </Field>
        <Button
          onClick={() => addToken.mutate({ queueId: selectedQueue, username })}
          disabled={addToken.isPending || !username.trim() || !selectedQueue}
          title={
            !username.trim()
              ? "Please enter a name"
              : !selectedQueue
                ? "Please select a queue"
                : ""
          }
        >
          {addToken.isPending && <Loader2 className="animate-spin" />}
          Add To Queue
        </Button>
      </FieldSet>
    </section>
  );
};

export default AddTokenCard;
