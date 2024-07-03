export type NetworkStats = {
  totalUsers: number;
  totalTransactions: number;
  totalBlocks: number;
  tps: number;
};

export type Block = {
  blockNumber: number;
  timestamp: string;
  transactions: Transaction[];
};

export type Transaction = {
  txHash: string;
  from: string;
  to: string;
  value: string;
};
