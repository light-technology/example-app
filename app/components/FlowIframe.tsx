import React, { useEffect } from 'react';

interface FlowIframeProps {
  url: string;
  onClose: () => void;
}

const FlowIframe: React.FC<FlowIframeProps> = ({ url, onClose }) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const eventType = event.data?.type;
      if (!eventType) {
        return;
      }
      if (eventType === 'light-flow-close') {
        onClose();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50">
      <iframe
        src={url}
        className="w-full h-full border-0"
        title="Flow"
        allow="camera; microphone; payment; encrypted-media"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
      />
    </div>
  );
};

export default FlowIframe;
