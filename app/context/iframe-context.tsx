import * as React from "react";

interface IframeContextValue {
  isInIframe: boolean;
}

const IframeContext = React.createContext<IframeContextValue>({
  isInIframe: false,
});

export function IframeProvider({ children }: { children: React.ReactNode }) {
  const [isInIframe, setIsInIframe] = React.useState(false);

  React.useEffect(() => {
    // Check if running in iframe
    const inIframe = window.self !== window.top;
    setIsInIframe(inIframe);
  }, []);

  return (
    <IframeContext.Provider value={{ isInIframe }}>
      {children}
    </IframeContext.Provider>
  );
}

export function useIframe() {
  const context = React.useContext(IframeContext);
  if (!context) {
    throw new Error("useIframe must be used within IframeProvider");
  }
  return context;
}
