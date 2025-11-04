import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { formatCurrency } from '../../utils/helpers';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface Payment {
  id: number;
  transaction_id: string;
  student_id: number;
  student_name: string;
  course_id: number;
  course_name: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  payment_method: string;
  payment_date: string;
}

interface PaymentAnalyticsChartProps {
  payments: Payment[];
}

const PaymentAnalyticsChart: React.FC<PaymentAnalyticsChartProps> = ({ payments }) => {
  // Calculate payment statistics
  const stats = useMemo(() => {
    const completed = payments.filter(p => p.status === 'completed');
    const pending = payments.filter(p => p.status === 'pending');
    const failed = payments.filter(p => p.status === 'failed');

    return {
      completedCount: completed.length,
      pendingCount: pending.length,
      failedCount: failed.length,
      completedAmount: completed.reduce((sum, p) => sum + p.amount, 0),
      pendingAmount: pending.reduce((sum, p) => sum + p.amount, 0),
      failedAmount: failed.reduce((sum, p) => sum + p.amount, 0),
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    };
  }, [payments]);

  const data = {
    labels: ['Complété', 'En attente', 'Échoué'],
    datasets: [
      {
        label: 'Paiements',
        data: [stats.completedCount, stats.pendingCount, stats.failedCount],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12,
          },
          color: '#64748b',
          usePointStyle: true,
          padding: 15,
          generateLabels: function (chart: any) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const value = data.datasets[0].data[i];
                const amount = i === 0 ? stats.completedAmount : i === 1 ? stats.pendingAmount : stats.failedAmount;
                return {
                  text: `${label}: ${value} (${formatCurrency(amount)})`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  lineWidth: data.datasets[0].borderWidth,
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: 'Inter, system-ui, sans-serif',
          size: 13,
          weight: 'bold' as const,
        },
        bodyFont: {
          family: 'Inter, system-ui, sans-serif',
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const amount = context.dataIndex === 0 ? stats.completedAmount : 
                          context.dataIndex === 1 ? stats.pendingAmount : stats.failedAmount;
            return `${label}: ${value} paiement${value !== 1 ? 's' : ''} (${formatCurrency(amount)})`;
          },
        },
      },
    },
    cutout: '60%',
  };

  return (
    <div>
      {/* Center text with total revenue */}
      <div className="relative" style={{ height: '300px' }}>
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-3xl font-bold text-primary-main">
            {formatCurrency(stats.totalAmount)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Total
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-sm text-gray-600 mb-1">Complété</div>
          <div className="text-xl font-bold text-green-600">
            {formatCurrency(stats.completedAmount)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.completedCount} paiement{stats.completedCount !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-sm text-gray-600 mb-1">En attente</div>
          <div className="text-xl font-bold text-yellow-600">
            {formatCurrency(stats.pendingAmount)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.pendingCount} paiement{stats.pendingCount !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-sm text-gray-600 mb-1">Échoué</div>
          <div className="text-xl font-bold text-red-600">
            {formatCurrency(stats.failedAmount)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.failedCount} paiement{stats.failedCount !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAnalyticsChart;
