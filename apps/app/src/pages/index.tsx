import Link from "next/link";
import { Layout } from "~/components/Layout";
import { apps } from "~/data/mock";

export default function Home() {
  return (
    <Layout>
      <div className="flex gap-2">
        {apps.map((app) => (
          <Link
            key={app.url}
            href={`/app?url=${encodeURIComponent(app.url)}`}
            className=""
          >
            <div className="h-24 w-24 rounded border bg-gray-100"></div>
            <div className="text-center text-sm">{app.name}</div>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
