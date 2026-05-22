import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function PriorityChart({ data = [] }) {
  const map = { low: 0, medium: 0, high: 0 };
  data.forEach((d) => {
    if (map[d._id] !== undefined) map[d._id] = d.count;
  });

  const chartData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        data: [map.low, map.medium, map.high],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="card p-5">
      <h3 className="font-semibold mb-3">Tasks by priority</h3>
      <div className="h-64 flex items-center justify-center">
        <Doughnut
          data={chartData}
          options={{
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
            cutout: '65%',
          }}
        />
      </div>
    </div>
  );
}
