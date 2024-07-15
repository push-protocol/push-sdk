// components/LatestBlocksComponent.tsx

import React from 'react';

interface Block {
  blockNumber: number;
  timestamp: string;
  // Add more block details as needed
}

interface LatestBlocksProps {
  blocks: Block[];
}

const LatestBlocksComponent: React.FC<LatestBlocksProps> = ({ blocks }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Latest Blocks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blocks.map((block) => (
          <BlockCard key={block.blockNumber} block={block} />
        ))}
      </div>
    </div>
  );
};

interface BlockCardProps {
  block: Block;
}

const BlockCard: React.FC<BlockCardProps> = ({ block }) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-md">
      <h3 className="text-lg font-semibold">Block #{block.blockNumber}</h3>
      <p className="text-gray-500">Timestamp: {block.timestamp}</p>
      {/* Display other block details */}
    </div>
  );
};

export default LatestBlocksComponent;
