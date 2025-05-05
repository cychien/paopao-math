import {
  createContext,
  useContext,
  useState,
  useCallback,
  MutableRefObject,
  useRef,
} from "react";

interface FlashCtx {
  isHighlighted: boolean;
  flash: () => void;
  targetRef: MutableRefObject<HTMLDivElement | null>;
}

const FlashContext = createContext<FlashCtx | undefined>(undefined);

export function FlashProvider({ children }: { children: React.ReactNode }) {
  const [isHighlighted, setHighlighted] = useState(false);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const flash = useCallback(() => {
    setHighlighted(true);
    setTimeout(() => setHighlighted(false), 500);
  }, []);

  return (
    <FlashContext.Provider value={{ isHighlighted, flash, targetRef }}>
      {children}
    </FlashContext.Provider>
  );
}

export function useFlash() {
  const ctx = useContext(FlashContext);
  if (!ctx) throw new Error("useFlash must be used inside <FlashProvider>");
  return ctx;
}
