import { ConnectButton } from "@rainbow-me/rainbowkit";
import Head from "next/head";
import Link from "next/link";
import { type PropsWithChildren, useEffect, useState } from "react";
import { useProfile } from "~/hooks/useProfile";

export const Layout = (props: PropsWithChildren) => {
  const profile = useProfile();
  const [isLoaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
  if (!isLoaded) return null;
  console.log(profile.data);
  return (
    <>
      <Head>
        <title>Allo App</title>
        <meta name="description" content="allo app marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto h-screen max-w-screen-sm ">
        <header className="flex items-center justify-between border-b p-2">
          <div className="flex gap-2">
            <Link href={"/"}>Apps</Link>
          </div>
          <div className="flex items-center gap-2">
            {profile.data ? (
              <div className="">Profile: {profile.data?.name}</div>
            ) : profile.isLoading ? (
              "..."
            ) : (
              <Link href="/profile/create">Create Profile</Link>
            )}
            <ConnectButton />
          </div>
        </header>
        <div className="p-4">{props.children}</div>
      </main>
    </>
  );
};
