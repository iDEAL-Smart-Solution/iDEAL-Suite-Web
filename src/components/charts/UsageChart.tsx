import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface UsageData {
  name: string;
  count: number;
}

interface Props {
  data: UsageData[];
}

const UsageChart = ({ data }: Props) => {
  return (
    <div className="bg-surface-800 border border-surface-700 rounded-xl p-6 shadow-sm">
      <h3 className="text-base font-semibold text-white mb-4">Platform Usage</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageChart;
