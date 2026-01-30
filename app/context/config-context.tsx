import * as React from "react";

export type ConfigValue = { isPreviewMode?: boolean; configId?: string };

interface ConfigContextValue {
  isPreviewMode?: boolean;
  configId?: string;
}

const ConfigContext = React.createContext<ConfigContextValue | undefined>(
  undefined,
);

export function ConfigProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ConfigValue;
}) {
  const [valueState] = React.useState<ConfigValue>(() => value);

  return (
    <ConfigContext.Provider value={valueState}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = React.useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}
