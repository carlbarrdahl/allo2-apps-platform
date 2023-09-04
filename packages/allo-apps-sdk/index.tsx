import {
  type PropsWithChildren,
  createContext,
  useState,
  useContext,
  useMemo,
} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AlloAppSDK } from "./src/sdk";

const queryClient = new QueryClient();

const Context = createContext<AlloAppSDK>({} as AlloAppSDK);

export function AlloProvider({
  children,
  profileId,
}: { profileId?: string } & PropsWithChildren) {
  const [sdk] = useState(() => new AlloAppSDK());

  const value = useMemo(() => ({ ...sdk, profileId }), [sdk, profileId]);

  return (
    <QueryClientProvider client={queryClient}>
      <Context.Provider value={value}>{children}</Context.Provider>
    </QueryClientProvider>
  );
}

export function useAlloAppsSDK() {
  return useContext(Context);
}
