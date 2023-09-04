import { type AppType } from "next/dist/shared/lib/utils";
import { AlloProvider } from "allo-apps-sdk";

import "~/styles/globals.css";
import { useRouter } from "next/router";

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  console.log(router.query);
  return (
    <AlloProvider {...router.query}>
      <Component {...pageProps} />
    </AlloProvider>
  );
};

export default MyApp;
