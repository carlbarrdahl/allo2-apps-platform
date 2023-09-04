import { Allo, Registry, chains } from "allo-v2-sdk";
import {
  useMutation as QueryUseMutation,
  useQuery as QueryUseQuery,
} from "@tanstack/react-query";

import { encodeAbiParameters, zeroAddress } from "viem";

class Communicator {
  // eslint-disable-next-line
  private callbacks = new Map<string, (res: any) => void>();

  private isServer = typeof window === "undefined";
  constructor() {
    if (!this.isServer) {
      window.addEventListener("message", this.onParentMessage);
    }
  }

  public async send<M, P, R>(method: M, params: P) {
    const request = formatMessage(method, params);
    console.log(request);
    window.parent.postMessage(request, "*");

    return new Promise((resolve, reject) => {
      this.callbacks.set(request.id, (res: Response<R>) =>
        res.success ? resolve(res) : reject(new Error(res.error))
      );
    });
  }
  // from parent App
  private onParentMessage = (msg: MessageEvent<Response>) => {
    const { id } = msg.data;
    console.log("message received", msg.data, this.callbacks);
    const cb = this.callbacks.get(id);

    if (cb) {
      cb(msg.data);
      this.callbacks.delete(id);
    }
  };
}
function formatMessage<M, P>(method: M, params: P) {
  const id = new Date().getTime().toString(36);
  return { id, method, params };
}

const communicator = new Communicator();
const allo = new Allo({ chain: chains.optimismGoerli });
const registry = new Registry({ chain: chains.optimismGoerli });
export class AlloAppSDK {
  public api = createAPI({ allo, registry, communicator });
  public allo: Allo;
  public registry: Registry;
  public communicator: Communicator;
  utils = { encodeAbiParameters, zeroAddress };
  constructor() {
    // this.api = createAPI({ allo, registry, communicator });
    this.communicator = communicator;
    this.allo = allo;
    this.registry = registry;
  }
}

export type Response<T = Methods> = {
  id: string;
  method: string;
  data: T;
  error?: string;

  success?: true;
};

enum Methods {
  sendTransaction,
}

// TODO: Fix typings
function createAPI({
  allo,
  registry,
  communicator,
}: {
  allo: Allo;
  registry: Registry;
  communicator: Communicator;
}) {
  function createApiMethod<P extends unknown[], R>(
    method: (...args: P) => R,
    queryType: "query" | "mutation"
  ) {
    // Call Allo2 SDK
    const rpcMethod = { mutation: "sendTransaction", query: "call" }[queryType];

    const apiMethod = (...args: P) =>
      Promise.resolve(method(...args)).then((tx) =>
        communicator.send(rpcMethod, tx)
      );

    // Set up React Query hooks
    switch (queryType) {
      case "query": {
        apiMethod.useQuery = (...args: P) =>
          QueryUseQuery([method, args], async () => apiMethod(...args));
      }
      case "mutation": {
        apiMethod.useMutation = () =>
          QueryUseMutation((...args: unknown[]) => apiMethod(...(args as P)));
      }
    }
    return apiMethod;
  }

  return {
    getProfileById: createApiMethod(
      registry.getProfileById.bind(registry),
      "query"
    ),
    getPool: createApiMethod(allo.getPool.bind(allo), "query"),
    createPool: createApiMethod(allo.createPool.bind(allo), "mutation"),
  };
}
