import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { SendTransactionParameters } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import { Layout } from "~/components/Layout";
import { useProfile } from "~/hooks/useProfile";

export default function App() {
  const { query } = useRouter();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { data: profile } = useProfile();

  const url =
    decodeURIComponent(query.url as string) + `?profileId=${profile?.id}`;

  const ref = useRef<HTMLIFrameElement>(null);

  // Listen to events from app and send to wallet
  useEffect(() => {
    window.addEventListener(
      "message",
      // TODO: Fix typings
      (e: MessageEvent<{ data: { method: string; params: unknown } }>) => {
        const { data } = e;
        const iframe = ref.current?.contentWindow;
        const methods = {
          call: publicClient.call,
          sendTransaction: walletClient?.sendTransaction,
        };
        const method = methods[data.method as keyof typeof methods];
        if (method && iframe) {
          console.log("message", data);
          // Call RPC and return response to iframe App
          method(data.params)
            .then((data) => iframe.postMessage({ success: true, data }, "*"))
            .catch((error) => iframe.postMessage({ error }, "*"));
        }
      },
      false,
    );
  }, [walletClient, publicClient]);
  if (!url) {
    return <div>App not found</div>;
  }

  return (
    <Layout>
      <iframe ref={ref} className="h-[500px] w-full border" src={url} />
    </Layout>
  );
}
