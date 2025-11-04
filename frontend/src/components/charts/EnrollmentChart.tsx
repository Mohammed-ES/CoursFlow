import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EnrollmentChart: React.FC = () => {
  // Weekly enrollment data (current week)
  const data = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Inscriptions',
        data: [2, 1, 0, 0, 0, 0, 0], // Current week: 3 students total
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(34, 197, 94, 0.3)',
          'rgba(34, 197, 94, 0.3)',
          'rgba(34, 197, 94, 0.3)',
          'rgba(34, 197, 94, 0.3)',
          'rgba(34, 197, 94, 0.3)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(34, 197, 94)',
          'rgb(34, 197, 94)',
          'rgb(34, 197, 94)',
          'rgb(34, 197, 94)',
          'rgb(34, 197, 94)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12,
          },
          color: '#64748b',
          usePointStyle: true,
          padding: 15,
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
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' étudiant' + (context.parsed.y !== 1 ? 's' : '');
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11,
          },
          color: '#94a3b8',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11,
          },
          color: '#94a3b8',
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default EnrollmentChart;
