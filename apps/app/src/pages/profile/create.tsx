import { useAccount } from "wagmi";
import { Layout } from "~/components/Layout";
import { useCreateProfile } from "~/hooks/useProfile";

function CreateProfileForm() {
  const { address } = useAccount();
  const create = useCreateProfile();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (address) {
          const { name } = Object.fromEntries(new FormData(e.target));
          console.log({ name });
          create.write?.({
            args: [0n, name, { pointer: "", protocol: 1n }, address, []],
          });
        }
      }}
    >
      <label>
        Name
        <input name="name" className="border p-2" autoFocus />
      </label>

      <div className="flex justify-end">
        <button className="bg-gray-200 p-2" color={"primary"}>
          Create Profile
        </button>
      </div>
    </form>
  );
}

export default function CreateProfile() {
  return (
    <Layout>
      <CreateProfileForm />
    </Layout>
  );
}
