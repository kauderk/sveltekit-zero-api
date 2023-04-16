// * The point of helpers is to be re-exported by `api.ts`, which can be useful in frontend development

import type { UnionToIntersection } from './types/utility.js'

/** Ex. `errors: { one?: string } | { two?: string }` becomes `{ one?: string } & {two?: string }` */
export function intersect<T>(obj: T) {
	return obj as UnionToIntersection<T>
}

export type { RequestParams, ResponseBody, GetResponse } from './types/zeroapi.js'