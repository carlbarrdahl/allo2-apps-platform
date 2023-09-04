# Allo Apps Platform

What if there was an app platform for Allo2?

In a similar way to Gnosis Safe where you can load apps in iframes that access your connected Safe, an Allo app could be built and loaded in an iframe.

### Why?

- It would simplify building apps on Allo
- It would create a kind of marketplace of apps for the Allo protocol
- community-shared components that are plug and play
- ...?

### How?

#### Allo Apps Platform

The platform app is like a browser. The user connects their wallet, manages their profile, discover apps, and renders them in an iframe. Similar to Gnosis Safe.

It listens for messages (encoded function calls/txs) from the iframe (app) and sends them to the wallet where the user signs.

#### Allo Apps SDK

The Apps SDK consist of:

- Allo2 SDK to call contracts
- GraphQL API to query on-chain data
- PostMessage bridge between Platform and App
- React Provider (`AlloProvider`)

#### Allo App

- Uses `AlloProvider` and `useAlloAppsSDK()` to access the sdk
- Is hosted and managed by developer and can be accessed with
  - `https://platform.allo.app?url=https://third.party.app`

#### Examples

The AlloProvider provides all the required methods to interact with Allo contracts. They are also wrapped in ReactQuery useMutation and useQuery to handle caching, loading, and error states.

Ready to use components for common UI and logic could be shared with the community similar to what Lens Protocol does.

```jsx
const MyApp = () => {
  return (
    <AlloProvider>
      <FundPool />
    </AlloProvider>
  );
};

const FundPool = () => {
  const sdk = useAlloAppsSDK();
  const fund = sdk.allo.fundPool.useMutation();
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const { amount, poolId } = Object.fromEntries(new FormData(e.target));
        fund.mutate(poolId, amount);
      }}
    >
      <label>
        Pool ID
        <input type="number" name="poolId" />
      </label>
      <label>
        Amount
        <input type="number" name="amount" />
      </label>
      <button type="submit" disabled={fund.isLoading}>
        Fund Pool
      </button>
    </form>
  );
};

const ProjectsDonate = ({ poolId }) => {
  const sdk = useAlloAppsSDK();
  const allocate = sdk.allo.allocate.useMutation();
  // Would be cool if the indexer could be queried like this
  const projects = sdk.graph.Registered.useQuery({ poolId });
  return (
    <ol>
      {projects.data?.map((project) => (
        <li key={project.id}>
          <h3>{project.name}</h3>
          <button
            disabled={allocate.isLoading}
            onClick={() =>
              allocate.mutate(
                poolId,
                sdk.utils.encodeAbiParameters(
                  [{ name: "amount", type: "uint256" }],
                  [sdk.utils.parseUnits(10, 6)]
                )
              )
            }
          >
            Donate $10
          </button>
        </li>
      ))}
    </ol>
  );
};
```

#### App ideas

I like the idea of local apps that bridge online/offline. especially those that empower communities and help them regenerate in different ways. Each app could be a specific niche (microapps).

Here are some examples:

- micro-tipping/qf-voting for example art galleries
- fund and provide clean water stations to areas that dont have yet (and other local regen projects)
- nature cleanups (beach, parks, rivers, oceans, forests, ...)
- open-mic events (allocations can actually serve as tickets where each ticket is a vote to a specfic act, then qf distribute along that) (could actually be useful for more than just open-mic events)
- a place where projects like this can be supported (https://zachklein.com/Sidewalk+Garden)
- governance and proposals could probably be built on Allo2 also

Would love to hear more ideas on what's possible to build!

---

# Turborepo starter

This is an official starter Turborepo.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `ui`: a stub React component library shared by both `web` and `docs` applications
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
