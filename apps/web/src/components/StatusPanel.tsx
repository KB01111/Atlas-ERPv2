import { AlertCircle, CheckCircle, Clock, RefreshCw, XCircle } from 'lucide-react';
import { useState } from 'react';

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'unhealthy' | 'warning' | 'checking';
  lastChecked: string;
  responseTime?: number;
  details?: string;
}

const initialServices: ServiceStatus[] = [
  {
    name: 'API Server',
    status: 'healthy',
    lastChecked: new Date().toLocaleTimeString(),
    responseTime: 45,
    details: 'All endpoints responding normally',
  },
  {
    name: 'Supabase',
    status: 'healthy',
    lastChecked: new Date().toLocaleTimeString(),
    responseTime: 120,
    details: 'Database connections stable',
  },
  {
    name: 'ArangoDB',
    status: 'warning',
    lastChecked: new Date().toLocaleTimeString(),
    responseTime: 250,
    details: 'High response time detected',
  },
  {
    name: 'CopilotKit',
    status: 'healthy',
    lastChecked: new Date().toLocaleTimeString(),
    responseTime: 89,
    details: 'AI assistant ready',
  },
  {
    name: 'MinIO Storage',
    status: 'healthy',
    lastChecked: new Date().toLocaleTimeString(),
    responseTime: 67,
    details: 'Object storage operational',
  },
];

export default function StatusPanel() {
  const [services, setServices] = useState<ServiceStatus[]>(initialServices);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className='w-4 h-4 text-green-500' />;
      case 'unhealthy':
        return <XCircle className='w-4 h-4 text-red-500' />;
      case 'warning':
        return <AlertCircle className='w-4 h-4 text-yellow-500' />;
      case 'checking':
        return <Clock className='w-4 h-4 text-blue-500 animate-pulse' />;
      default:
        return <Clock className='w-4 h-4 text-gray-500' />;
    }
  };

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'unhealthy':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'checking':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const refreshStatus = async () => {
    setIsRefreshing(true);

    // Simulate API calls to check service status
    const updatedServices = services.map(service => ({
      ...service,
      status: 'checking' as const,
    }));
    setServices(updatedServices);

    // Simulate checking each service
    setTimeout(() => {
      const finalServices = services.map(service => ({
        ...service,
        status: Math.random() > 0.8 ? 'warning' : ('healthy' as const),
        lastChecked: new Date().toLocaleTimeString(),
        responseTime: Math.floor(Math.random() * 200) + 50,
      }));
      setServices(finalServices);
      setIsRefreshing(false);
    }, 2000);
  };

  const healthyCount = services.filter(s => s.status === 'healthy').length;
  const totalCount = services.length;
  const overallHealth = (healthyCount / totalCount) * 100;

  return (
    <div className='bg-card border rounded-xl p-6 shadow-sm'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-lg font-semibold'>System Status</h2>
        <button
          onClick={refreshStatus}
          disabled={isRefreshing}
          className='p-2 hover:bg-accent rounded-md transition-colors disabled:opacity-50'
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Overall Health */}
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-sm font-medium'>Overall Health</span>
          <span className='text-sm text-muted-foreground'>
            {healthyCount}/{totalCount} services
          </span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-2'>
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              overallHealth >= 80
                ? 'bg-green-500'
                : overallHealth >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
            }`}
            style={{ width: `${overallHealth}%` }}
          />
        </div>
      </div>

      {/* Service List */}
      <div className='space-y-3'>
        {services.map((service, index) => (
          <div
            key={index}
            className='flex items-center justify-between p-3 bg-background rounded-lg border'
          >
            <div className='flex items-center gap-3'>
              {getStatusIcon(service.status)}
              <div>
                <div className='font-medium text-sm'>{service.name}</div>
                <div className='text-xs text-muted-foreground'>{service.details}</div>
              </div>
            </div>
            <div className='text-right'>
              <div className={`text-sm font-medium ${getStatusColor(service.status)}`}>
                {service.status === 'checking' ? 'Checking...' : service.status}
              </div>
              <div className='text-xs text-muted-foreground'>
                {service.responseTime && `${service.responseTime}ms`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Last Updated */}
      <div className='mt-4 pt-4 border-t'>
        <p className='text-xs text-muted-foreground text-center'>
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
