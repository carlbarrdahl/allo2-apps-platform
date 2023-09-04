import Allo from "~/abi/Allo.json";
import Registry from "~/abi/Registry.json";
import DirectGrantsSimple from "~/abi/DirectGrantsSimple.json";

export const contracts = {
  Registry: {
    address: "0xAEc621EC8D9dE4B524f4864791171045d6BBBe27",
    abi: Registry,
  },
  Allo: {
    address: "0x79536CC062EE8FAFA7A19a5fa07783BD7F792206",
    abi: Allo,
  },
  DirectGrantsSimple: {
    address: "0xf243619f931c81617EE00bAAA5c5d97aCcC5af10",
    abi: DirectGrantsSimple,
  },
} as const;
