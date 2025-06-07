import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from './root';
import type { Session } from './trpc';
import { appRouter } from './root';
import { createCallerFactory, createTRPCContext } from './trpc';

/**
 * Create a server-side caller for the tRPC API
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.user.all();
 *       ^? User[]
 */
const createCaller = createCallerFactory(appRouter);

/**
 * Inference helpers for input types
 * @example
 * type UserByIdInput = RouterInputs['user']['byId']
 *      ^? { id: string }
 **/
type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example
 * type AllUsersOutput = RouterOutputs['user']['all']
 *      ^? User[]
 **/
type RouterOutputs = inferRouterOutputs<AppRouter>;

export { appRouter, createCaller, createTRPCContext };
export type { AppRouter, RouterInputs, RouterOutputs, Session };
