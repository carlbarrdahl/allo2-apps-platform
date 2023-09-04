"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
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
var allo_apps_sdk_exports = {};
__export(allo_apps_sdk_exports, {
  AlloProvider: () => AlloProvider,
  useAlloAppsSDK: () => useAlloAppsSDK
});
module.exports = __toCommonJS(allo_apps_sdk_exports);
var import_react = require("react");
var import_react_query2 = require("@tanstack/react-query");

// src/sdk.ts
var import_allo_v2_sdk = require("allo-v2-sdk");
var import_react_query = require("@tanstack/react-query");
var import_viem = require("viem");
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
var allo = new import_allo_v2_sdk.Allo({ chain: import_allo_v2_sdk.chains.optimismGoerli });
var registry = new import_allo_v2_sdk.Registry({ chain: import_allo_v2_sdk.chains.optimismGoerli });
var AlloAppSDK = class {
  constructor() {
    this.api = createAPI({ allo, registry, communicator });
    this.utils = { encodeAbiParameters: import_viem.encodeAbiParameters, zeroAddress: import_viem.zeroAddress };
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
        apiMethod.useQuery = (...args) => (0, import_react_query.useQuery)([method, args], () => __async(this, null, function* () {
          return apiMethod(...args);
        }));
      }
      case "mutation": {
        apiMethod.useMutation = () => (0, import_react_query.useMutation)((...args) => apiMethod(...args));
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
var import_jsx_runtime = require("react/jsx-runtime");
var queryClient = new import_react_query2.QueryClient();
var Context = (0, import_react.createContext)({});
function AlloProvider({
  children,
  profileId
}) {
  const [sdk] = (0, import_react.useState)(() => new AlloAppSDK());
  const value = (0, import_react.useMemo)(() => __spreadProps(__spreadValues({}, sdk), { profileId }), [sdk, profileId]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_query2.QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Context.Provider, { value, children }) });
}
function useAlloAppsSDK() {
  return (0, import_react.useContext)(Context);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AlloProvider,
  useAlloAppsSDK
});
