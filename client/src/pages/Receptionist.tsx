import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Check, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import Navbar from "@/components/Navbar";
import RoomCard from "@/components/RoomCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { QueueType, TokenType } from "@/types";
import AddTokenCard from "@/components/AddTokenCard";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import DisplayQueue from "@/components/DisplayQueue";
import Stats from "@/components/Stats";

const Receptionist = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedTokenStatus, setSelectedTokenStatus] = useState<string[]>([
    "Waiting",
    "Called",
  ]);

  const {
    isPending: queuesDataPending,
    error: queuesDataError,
    data: queuesData,
  } = useQuery({
    queryKey: ["queues"],
    queryFn: () =>
      api
        .getQueues()
        .then((res) => res.queues as QueueType[])
        .catch((err) => console.error(err)),
  });

  const {
    isPending: tokensDataPending,
    error: tokensDataError,
    data: tokensData,
  } = useQuery({
    queryKey: ["tokens"],
    queryFn: () =>
      api
        .getTokens()
        .then((res) => res.tokens as TokenType[])
        .catch((err) => console.error(err)),
  });

  const fetchUserData = async () => {
    try {
      const response = await api.getMe().catch((err) => console.error(err));

      if (response && response.user) {
        // const user = response.user;
        // console.log("User data fetched successfully:", user);
      } else {
        toast.error("User not found. Please log in again.");
        navigate("/login");
      }
    } catch (error) {}
  };

  useEffect(() => {
    document.title = "Receptionist | Queue Cure";

    fetchUserData();

    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["queues"] });
      queryClient.invalidateQueries({ queryKey: ["tokens"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    }, 10 * 1000); // Refresh every 10 seconds

    setSelectedRooms(queuesData?.map((queue) => queue.queueId) || []);

    return () => clearInterval(interval);
  }, [queuesData, tokensData]);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="w-full h-[calc(100vh-40px)] grid grid-cols-4 grid-rows-1 p-2 pt-0 gap-2 bg-zinc-100 dark:bg-zinc-950">
        <div className="grid grid-cols-1 col-span-3 grid-rows-[auto_1fr] gap-2 h-full min-h-0">
          <div className="grid grid-cols-10 gap-2">
            {/* Add to Queue */}
            <AddTokenCard queues={queuesData} />

            {/* Status */}
            <Stats />
          </div>

          {/* Table */}
          <section className="bg-card rounded flex px-3 flex-col min-h-0">
            <div className="flex items-center gap-2 justify-between my-3">
              <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Live Queue
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Sort By Time</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={sortOrder}
                      onValueChange={(value) =>
                        setSortOrder(value as "asc" | "desc")
                      }
                    >
                      <DropdownMenuRadioItem value="asc">
                        Oldest First
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="desc">
                        Newest First
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                  <Separator className="my-1" />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                      checked={selectedTokenStatus.includes("Waiting")}
                      onCheckedChange={() => {
                        if (selectedTokenStatus.includes("Waiting")) {
                          setSelectedTokenStatus((prev) =>
                            prev.filter((status) => status !== "Waiting"),
                          );
                        } else {
                          setSelectedTokenStatus((prev) => [
                            ...prev,
                            "Waiting",
                          ]);
                        }
                      }}
                    >
                      Waiting
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedTokenStatus.includes("Called")}
                      onCheckedChange={() => {
                        if (selectedTokenStatus.includes("Called")) {
                          setSelectedTokenStatus((prev) =>
                            prev.filter((status) => status !== "Called"),
                          );
                        } else {
                          setSelectedTokenStatus((prev) => [...prev, "Called"]);
                        }
                      }}
                    >
                      Called
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedTokenStatus.includes("Completed")}
                      onCheckedChange={() => {
                        if (selectedTokenStatus.includes("Completed")) {
                          setSelectedTokenStatus((prev) =>
                            prev.filter((status) => status !== "Completed"),
                          );
                        } else {
                          setSelectedTokenStatus((prev) => [
                            ...prev,
                            "Completed",
                          ]);
                        }
                      }}
                    >
                      Completed
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    <TableHead className="w-25">Token</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Arrival Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokensData && queuesData ? (
                    <DisplayQueue
                      tokensData={tokensData}
                      queuesData={queuesData}
                      sortOrder={sortOrder}
                      selectedTokenStatus={selectedTokenStatus}
                    />
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground"
                      >
                        No tokens data available.
                      </TableCell>
                    </TableRow>
                  )}
                  {tokensDataPending && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground"
                      >
                        Loading tokens data...
                      </TableCell>
                    </TableRow>
                  )}
                  {selectedTokenStatus.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground"
                      >
                        No tokens to display. Please select at least one status
                        filter.
                      </TableCell>
                    </TableRow>
                  )}
                  {tokensDataError && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground"
                      >
                        {`Error loading tokens data: ${tokensDataError instanceof Error ? tokensDataError.message : "Unknown error"}`}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <section className="bg-card col-span-1 rounded p-3">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Live Clinic Map
          </h3>
          <div className="mt-2">
            <ToggleGroup
              variant="outline"
              type="multiple"
              value={selectedRooms}
              onValueChange={setSelectedRooms}
            >
              {queuesData &&
                queuesData.map((queue) => {
                  return (
                    <ToggleGroupItem
                      key={queue.queueId}
                      value={queue.queueId}
                      aria-label={queue.queueName}
                    >
                      <Check className="hidden group-data-[state=on]/toggle:block" />
                      {queue.queueName}
                    </ToggleGroupItem>
                  );
                })}
            </ToggleGroup>
          </div>
          <div>
            {queuesData &&
              queuesData.map((queue, index) => {
                if (!selectedRooms.includes(queue.queueId)) {
                  return null;
                }
                return (
                  <RoomCard
                    queueId={queue.queueId}
                    name={queue.queueName}
                    status={queue.status}
                    token={queue.token}
                    doctorName={queue.doctorName}
                    key={index}
                  />
                );
              })}

            {queuesDataPending && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                Loading queues data...
              </p>
            )}
            {selectedRooms.length === 0 && !queuesDataError && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                Please select a room to view its details.
              </p>
            )}
            {queuesDataError && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                {`Error loading queues data: ${queuesDataError instanceof Error ? queuesDataError.message : "Unknown error"}`}
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export { Receptionist };
