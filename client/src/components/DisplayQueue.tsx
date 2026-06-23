import type { QueueType, TokenType } from "@/types";
import QueueRow from "./QueueRow";
import { useEffect, useState } from "react";

const DisplayQueue = ({
  tokensData,
  queuesData,
  sortOrder,
  selectedTokenStatus,
}: {
  tokensData: TokenType[];
  queuesData: QueueType[];
  sortOrder: "asc" | "desc";
  selectedTokenStatus: string[];
}) => {
  const [filteredSortedTokens, setFilteredSortedTokens] = useState<
    (TokenType & { queueName?: string })[]
  >([]);

  useEffect(() => {
    const filteredTokens: (TokenType & { queueName?: string })[] =
      tokensData.filter((token) => selectedTokenStatus.includes(token.status));

    const sortedTokens = filteredTokens.sort((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime();
      } else {
        return new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime();
      }
    });

    sortedTokens.map((token) => {
      const queue = queuesData.find((queue) => queue.queueId === token.queueId);
      if (queue) {
        token.queueName = queue.queueName;
      }
    });

    setFilteredSortedTokens(sortedTokens);
  }, [tokensData, sortOrder, selectedTokenStatus]);

  if (filteredSortedTokens.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="text-center text-muted-foreground p-2">
          No tokens available.
        </td>
      </tr>
    );
  }

  return (
    <>
      {filteredSortedTokens.map((row) => {
        return (
          <QueueRow
            key={row.token}
            token={row.token}
            status={row.status}
            name={row.username}
            queueName={row.queueName}
            arrivalTime={row.issuedAt as any}
          />
        );
      })}
    </>
  );
};

export default DisplayQueue;
