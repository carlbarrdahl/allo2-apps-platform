import { useAlloAppsSDK } from "allo-apps-sdk";
import { type ChangeEvent, useState } from "react";

export default function Home() {
  const sdk = useAlloAppsSDK();
  console.log("sdk", sdk);
  return (
    <main>
      <h1 className="text-2xl font-bold">demo app</h1>

      <CreatePool />
    </main>
  );
}

// const PoolDetails = ({ id }) => {
//   const sdk = useAlloAppsSDK();

//   console.log("sdk", sdk);
//   const { data: pool } = sdk.api.getPool.useQuery({ id });

//   console.log("pool", pool);
//   return <div>pool details</div>;
// };

const CreatePool = ({}) => {
  const sdk = useAlloAppsSDK();
  const [state, setState] = useState({
    poolName: "",
    strategy: "0xf243619f931c81617EE00bAAA5c5d97aCcC5af10",
    // initStrategyData: [false, false, false],
    initStrategyData: sdk.utils.encodeAbiParameters(
      [
        { name: "registryGating", type: "bool" },
        { name: "metadataRequired", type: "bool" },
        { name: "grantAmountRequired", type: "bool" },
      ],
      [false, false, false],
    ),
    token: sdk.utils.zeroAddress,
    amount: 0,
    metadata: {
      protocol: 1,
      pointer: "",
    },
    managers: [],
  });
  console.log("sdk", sdk);
  const create = sdk.api.createPool.useMutation();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setState((s) => ({ ...s, [name]: value }));
  }
  console.log("pool", create, state);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log(Object.fromEntries(new FormData(e.target)));
        console.log({ ...state, profileId: sdk.profileId });
        create.mutate({ ...state, profileId: sdk.profileId });
      }}
    >
      <div>
        <label>Pool name</label>
        <input
          className="box border p-2"
          name="poolName"
          value={state.poolName}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Strategy</label>
        <input
          value={state.strategy}
          className="box border p-2"
          name="strategy"
          readOnly
        />
      </div>
      <button type="submit" className="border p-2">
        Create Pool
      </button>
    </form>
  );
};
