import React, { useState, useEffect } from 'react';

// Simple Chart Component (inline for demo)
const SimpleChart = ({
  data,
  title,
  type = 'bar',
}: {
  data: { label: string; value: number }[];
  title: string;
  type?: 'bar' | 'line';
}) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className='rounded-xl border bg-card text-card-foreground shadow p-6'>
      <h3 className='text-lg font-semibold mb-4'>{title}</h3>
      <div className='space-y-3'>
        {data.map((item, index) => (
          <div key={index} className='flex items-center space-x-3'>
            <span className='text-sm font-medium w-20 text-right'>{item.label}</span>
            <div className='flex-1 bg-muted rounded-full h-3 relative'>
              <div
                className='bg-primary h-3 rounded-full transition-all duration-500'
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <span className='text-sm text-muted-foreground w-12'>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AnalyticsCharts() {
  const [projectData, setProjectData] = useState([
    { label: 'Jan', value: 12 },
    { label: 'Feb', value: 19 },
    { label: 'Mar', value: 15 },
    { label: 'Apr', value: 22 },
    { label: 'May', value: 18 },
    { label: 'Jun', value: 25 },
  ]);

  const [taskData, setTaskData] = useState([
    { label: 'Completed', value: 198 },
    { label: 'In Progress', value: 156 },
    { label: 'Pending', value: 89 },
    { label: 'Overdue', value: 33 },
  ]);

  const [revenueData, setRevenueData] = useState([
    { label: 'Q1', value: 125000 },
    { label: 'Q2', value: 142000 },
    { label: 'Q3', value: 158000 },
    { label: 'Q4', value: 167000 },
  ]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Simulate new data
      setProjectData(prev =>
        prev.map(item => ({
          ...item,
          value: item.value + Math.floor(Math.random() * 10) - 5,
        }))
      );
      setIsLoading(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {[...Array(4)].map((_, i) => (
          <div key={i} className='rounded-xl border bg-card text-card-foreground shadow p-6'>
            <div className='animate-pulse'>
              <div className='h-4 bg-gray-200 rounded w-1/2 mb-4'></div>
              <div className='space-y-3'>
                {[...Array(4)].map((_, j) => (
                  <div key={j} className='h-3 bg-gray-200 rounded'></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Analytics Dashboard</h2>
        <button
          onClick={refreshData}
          className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2'
        >
          🔄 Refresh Data
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <SimpleChart data={projectData} title='📊 Projects by Month' type='bar' />

        <SimpleChart data={taskData} title='✅ Task Status Distribution' type='bar' />

        <SimpleChart data={revenueData} title='💰 Quarterly Revenue ($)' type='bar' />

        <div className='rounded-xl border bg-card text-card-foreground shadow p-6'>
          <h3 className='text-lg font-semibold mb-4'>📈 Key Metrics</h3>
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium'>Project Success Rate</span>
              <span className='text-lg font-bold text-green-600'>94.2%</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium'>Average Task Completion</span>
              <span className='text-lg font-bold text-blue-600'>3.2 days</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium'>Team Productivity</span>
              <span className='text-lg font-bold text-purple-600'>+12.5%</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium'>Customer Satisfaction</span>
              <span className='text-lg font-bold text-orange-600'>4.8/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
