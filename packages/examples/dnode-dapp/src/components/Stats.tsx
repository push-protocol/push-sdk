interface StatsProps {
  totalBlocks: number;
  tps: number;
  // Add more stats as needed
}

const StatsComponent: React.FC<StatsProps> = ({ totalBlocks, tps }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Blocks" value={totalBlocks} />
        <StatCard title="TPS" value={tps} />
        {/* Add more stats as needed */}
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-md">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-xl">{value}</p>
    </div>
  );
};

export default StatsComponent;
