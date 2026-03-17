import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface GrowthData {
  month: string;
  students: number;
}

interface Props {
  data: GrowthData[];
}

const StudentsGrowthChart = ({ data }: Props) => {
  return (
    <div className="bg-surface-800 border border-surface-700 rounded-xl p-6 shadow-sm">
      <h3 className="text-base font-semibold text-white mb-4">Student Growth</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="students"
            stroke="#22d3ee"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentsGrowthChart;
