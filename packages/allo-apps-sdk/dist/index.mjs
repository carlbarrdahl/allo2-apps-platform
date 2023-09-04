var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// index.tsx
import {
  createContext,
  useState,
  useContext,
  useMemo
} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// src/sdk.ts
import { Allo, Registry, chains } from "allo-v2-sdk";
import {
  useMutation as QueryUseMutation,
  useQuery as QueryUseQuery
} from "@tanstack/react-query";
import { encodeAbiParameters, zeroAddress } from "viem";
var Communicator = class {
  constructor() {
    // eslint-disable-next-line
    this.callbacks = /* @__PURE__ */ new Map();
    this.isServer = typeof window === "undefined";
    // from parent App
    this.onParentMessage = (msg) => {
      const { id } = msg.data;
      console.log("message received", msg.data, this.callbacks);
      const cb = this.callbacks.get(id);
      if (cb) {
        cb(msg.data);
        this.callbacks.delete(id);
      }
    };
    if (!this.isServer) {
      window.addEventListener("message", this.onParentMessage);
    }
  }
  send(method, params) {
    return __async(this, null, function* () {
      const request = formatMessage(method, params);
      console.log(request);
      window.parent.postMessage(request, "*");
      return new Promise((resolve, reject) => {
        this.callbacks.set(
          request.id,
          (res) => res.success ? resolve(res) : reject(new Error(res.error))
        );
      });
    });
  }
};
function formatMessage(method, params) {
  const id = (/* @__PURE__ */ new Date()).getTime().toString(36);
  return { id, method, params };
}
var communicator = new Communicator();
var allo = new Allo({ chain: chains.optimismGoerli });
var registry = new Registry({ chain: chains.optimismGoerli });
var AlloAppSDK = class {
  constructor() {
    this.api = createAPI({ allo, registry, communicator });
    this.utils = { encodeAbiParameters, zeroAddress };
    this.communicator = communicator;
    this.allo = allo;
    this.registry = registry;
  }
};
function createAPI({
  allo: allo2,
  registry: registry2,
  communicator: communicator2
}) {
  function createApiMethod(method, queryType) {
    const rpcMethod = { mutation: "sendTransaction", query: "call" }[queryType];
    const apiMethod = (...args) => Promise.resolve(method(...args)).then(
      (tx) => communicator2.send(rpcMethod, tx)
    );
    switch (queryType) {
      case "query": {
        apiMethod.useQuery = (...args) => QueryUseQuery([method, args], () => __async(this, null, function* () {
          return apiMethod(...args);
        }));
      }
      case "mutation": {
        apiMethod.useMutation = () => QueryUseMutation((...args) => apiMethod(...args));
      }
    }
    return apiMethod;
  }
  return {
    getProfileById: createApiMethod(
      registry2.getProfileById.bind(registry2),
      "query"
    ),
    getPool: createApiMethod(allo2.getPool.bind(allo2), "query"),
    createPool: createApiMethod(allo2.createPool.bind(allo2), "mutation")
  };
}

// index.tsx
import { jsx } from "react/jsx-runtime";
var queryClient = new QueryClient();
var Context = createContext({});
function AlloProvider({
  children,
  profileId
}) {
  const [sdk] = useState(() => new AlloAppSDK());
  const value = useMemo(() => __spreadProps(__spreadValues({}, sdk), { profileId }), [sdk, profileId]);
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(Context.Provider, { value, children }) });
}
function useAlloAppsSDK() {
  return useContext(Context);
}
export {
  AlloProvider,
  useAlloAppsSDK
};
