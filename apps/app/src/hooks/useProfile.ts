import { type Address } from "viem";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import { contracts } from "~/config/contracts";
import { ethers } from "ethers";

export function useCreateProfile() {
  const { abi, address } = contracts.Registry;
  return useContractWrite({
    address,
    abi,
    functionName: "createProfile",
  });
}

export function useProfile() {
  const { abi, address } = contracts.Registry;
  const account = useAccount();

  const profileId = getProfileId(account.address);

  const profile = useContractRead({
    abi,
    address,
    functionName: "getProfileById",
    args: [profileId as `0x${string}`],
    enabled: Boolean(profileId && account.address),
  });

  return {
    ...profile,
    data:
      profile.data?.id ===
      "0x0000000000000000000000000000000000000000000000000000000000000000"
        ? null
        : profile.data,
  };
}

function getProfileId(address?: Address) {
  try {
    const { solidityKeccak256 } = ethers.utils;
    return solidityKeccak256(["uint256", "address"], [0, address]);
  } catch (error) {
    return null;
  }
}
