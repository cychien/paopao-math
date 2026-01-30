import * as React from "react";

export type LiveEditingValue = Record<string, Record<string, any>>;

interface LiveEditingContextValue {
  liveEditing: LiveEditingValue;
  setLiveEditing: React.Dispatch<React.SetStateAction<LiveEditingValue>>;
}

const LiveEditingContext = React.createContext<
  LiveEditingContextValue | undefined
>(undefined);

export function LiveEditingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [liveEditing, setLiveEditing] = React.useState<LiveEditingValue>({});

  return (
    <LiveEditingContext.Provider value={{ liveEditing, setLiveEditing }}>
      {children}
    </LiveEditingContext.Provider>
  );
}

export function useLiveEditing() {
  const context = React.useContext(LiveEditingContext);
  if (!context) {
    throw new Error("useLiveEditing must be used within a LiveEditingProvider");
  }
  return context;
}
