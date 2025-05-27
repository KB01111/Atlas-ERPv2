import React, { Suspense, lazy, useEffect, useState } from 'react';

// Lazy load CopilotKit components to reduce initial bundle size
const CopilotKit = lazy(() =>
  import('@copilotkit/react-core').then(module => ({ default: module.CopilotKit }))
);
const CopilotPopup = lazy(() =>
  import('@copilotkit/react-ui').then(module => ({ default: module.CopilotPopup }))
);

interface CopilotProviderProps {
  children?: React.ReactNode;
}

// Loading component for CopilotKit
function CopilotLoading() {
  return (
    <div className='fixed bottom-4 right-4 z-50'>
      <div className='bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg animate-pulse'>
        Loading AI Assistant...
      </div>
    </div>
  );
}

export default function CopilotProvider({ children }: CopilotProviderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [loadCopilot, setLoadCopilot] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Delay loading CopilotKit to improve initial page load
    const timer = setTimeout(() => {
      setLoadCopilot(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Only render on client-side to prevent SSR issues
  if (!isMounted) {
    return <>{children}</>;
  }

  // Show children immediately, load CopilotKit later
  if (!loadCopilot) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={<CopilotLoading />}>
      <CopilotKit
        runtimeUrl='/api/copilotkit'
        publicApiKey={import.meta.env.PUBLIC_COPILOTKIT_API_KEY || 'ck_pub_atlas_erp_v2_demo'}
      >
        {children}
        <CopilotPopup
          labels={{
            title: 'Atlas ERP Assistant',
            initial:
              "Hi! I'm your Atlas ERP assistant. How can I help you manage your business today?",
          }}
          instructions='You are an AI assistant for Atlas ERP, a comprehensive enterprise resource planning system. You can help users with business operations, data analysis, document management, and workflow automation. Be helpful, professional, and provide actionable insights.'
        />
      </CopilotKit>
    </Suspense>
  );
}
