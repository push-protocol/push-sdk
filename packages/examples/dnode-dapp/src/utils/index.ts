// TODO: Implement All the Fns

import { getAddress } from 'viem';
import { Block, NetworkStats, Transaction } from '../types';

export const fetchNetworkStats = async (): Promise<NetworkStats> => {
  return {
    totalUsers: 100,
    totalTransactions: 1000,
    totalBlocks: 1000,
    tps: 10,
  };
};

export const fetchLatestBlocks = async (limit: number): Promise<Block[]> => {
  return [
    {
      blockNumber: 1000,
      timestamp: new Date().toISOString(),
      transactions: [],
    },
    {
      blockNumber: 999,
      timestamp: new Date().toISOString(),
      transactions: [],
    },
  ];
};

export const fetchBlock = async (blockNumber: number): Promise<Block> => {
  return {
    blockNumber,
    timestamp: new Date().toISOString(),
    transactions: [],
  };
};

export const fetchTransaction = async (
  txHash: string
): Promise<Transaction> => {
  return {
    txHash,
    from: '0x1234567890',
    to: '0x0987654321',
    value: '1000',
  };
};

export const getCheckSumAddress = (address: string): string => {
  const addr = address.toLowerCase();
  try {
    return getAddress(addr);
  } catch (e) {
    return addr;
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
