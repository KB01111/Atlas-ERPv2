import React, { useEffect, useState } from 'react';
import { CopilotKit, CopilotPopup } from '@copilotkit/react-core';
import '@copilotkit/react-ui/styles.css';

interface CopilotProviderProps {
  children?: React.ReactNode;
}

export default function CopilotProvider({ children }: CopilotProviderProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render on client-side to prevent SSR issues
  if (!isMounted) {
    return null;
  }

  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      publicApiKey={
        import.meta.env.PUBLIC_COPILOTKIT_API_KEY ||
        'ck_pub_atlas_erp_v2_demo'
      }
    >
      {children}
      <CopilotPopup
        labels={{
          title: 'Atlas ERP Assistant',
          initial: "Hi! I'm your Atlas ERP assistant. How can I help you manage your business today?",
        }}
        instructions="You are an AI assistant for Atlas ERP, a comprehensive enterprise resource planning system. You can help users with business operations, data analysis, document management, and workflow automation. Be helpful, professional, and provide actionable insights."
      />
    </CopilotKit>
  );
}
