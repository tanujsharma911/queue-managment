import { RefreshCwIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { StatType } from "@/types";
import { api } from "@/services/api";

const Stats = () => {
  const queryClient = useQueryClient();

  const { isPending: statsDataPending, data: statsData } = useQuery({
    queryKey: ["stats"],
    queryFn: () =>
      api
        .getStats()
        .then((res) => res.stats as StatType[])
        .catch((err) => console.error(err)),
  });

  return (
    <section className="bg-card col-span-7 rounded p-3 grid grid-rows-[auto_1fr]">
      <div className="mb-3 flex items-center gap-2">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Waiting Room Status
        </h3>
        <Button
          variant={"ghost"}
          onClick={() => queryClient.invalidateQueries({ queryKey: ["stats"] })}
        >
          <RefreshCwIcon className={cn(statsDataPending && "animate-spin")} />
        </Button>
      </div>
      <div className="grid grid-cols-3 grid-rows-2 gap-2">
        {statsData?.map((stat, i) => (
          <div
            className="border rounded p-3 flex flex-col justify-between"
            key={i}
          >
            <div className="flex items-center gap-2">
              {/* {status?.icon} */}
              <p className="text-2xl font-medium">
                {stat?.data || "No Enough Data"}
              </p>
            </div>
            <p className="text-sm font-light text-muted-foreground">
              {stat?.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
