import * as react_jsx_runtime from 'react/jsx-runtime';
import { PropsWithChildren } from 'react';
import * as allo_v2_sdk_src_Allo_types from 'allo-v2-sdk/src/Allo/types';
import * as _tanstack_react_query from '@tanstack/react-query';
import { Allo, Registry } from 'allo-v2-sdk';
import { encodeAbiParameters } from 'viem';

declare class Communicator {
    private callbacks;
    private isServer;
    constructor();
    send<M, P, R>(method: M, params: P): Promise<unknown>;
    private onParentMessage;
}
declare class AlloAppSDK {
    api: {
        getProfileById: {
            (profileId: string): Promise<unknown>;
            useQuery(profileId: string): _tanstack_react_query.UseQueryResult<unknown, unknown>;
            useMutation(): _tanstack_react_query.UseMutationResult<unknown, unknown, unknown, unknown>;
        };
        getPool: {
            (poolId: number): Promise<unknown>;
            useQuery(poolId: number): _tanstack_react_query.UseQueryResult<unknown, unknown>;
            useMutation(): _tanstack_react_query.UseMutationResult<unknown, unknown, unknown, unknown>;
        };
        createPool: {
            (args_0: allo_v2_sdk_src_Allo_types.CreatePoolArgs): Promise<unknown>;
            useQuery(args_0: allo_v2_sdk_src_Allo_types.CreatePoolArgs): _tanstack_react_query.UseQueryResult<unknown, unknown>;
            useMutation(): _tanstack_react_query.UseMutationResult<unknown, unknown, unknown, unknown>;
        };
    };
    allo: Allo;
    registry: Registry;
    communicator: Communicator;
    utils: {
        encodeAbiParameters: typeof encodeAbiParameters;
        zeroAddress: "0x0000000000000000000000000000000000000000";
    };
    constructor();
}

declare function AlloProvider({ children, profileId, }: {
    profileId?: string;
} & PropsWithChildren): react_jsx_runtime.JSX.Element;
declare function useAlloAppsSDK(): AlloAppSDK;

export { AlloProvider, useAlloAppsSDK };
