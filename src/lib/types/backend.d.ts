import type { API, APIInputs } from './zeroapi'
// Promise<{ ok: () => T }>
export type APIResponse<T extends { [key: string]: (...args: any[]) => any }> =
	Promise<T>

export type Method = <G extends APIInputs>(
	requestEvent: API<G>
) => Awaited<APIResponse<any>>

export type Monad = (...args: any[]) => (...args: any[]) => any

export interface Endpoint {
	[key: string]: Method
}
export interface EndpointMonad {
	[key: string]: Monad
}
