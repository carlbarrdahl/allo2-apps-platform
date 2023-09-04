const urls = process.env.NEXT_PUBLIC_DEMO_APPS?.split(",");

export const apps = [
  {
    id: "demo-app",
    name: "App Test",
    url: urls?.[0],
  },
  {
    id: "demo-app",
    name: "App #2",
    url: urls?.[1],
  },
];
