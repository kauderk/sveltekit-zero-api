export interface DefaultResponse {
	status: number
	body: Record<any, any>
	headers: Record<any, any>
	bodyUsed: boolean
	ok: boolean
	redirected: boolean
	statusText: string
	type: string
	url: string
}

/** Internal */
export type R<T extends Record<any, any> = Record<any, any>> = {
	[K in keyof DefaultResponse]: K extends keyof T
		? NonNullable<T[K]>
		: NonNullable<DefaultResponse[K]>
}

export type NoBodyResponse<T extends Record<any, any> = Record<any, any>> =
	Omit<R<T>, 'body'> & { body?: any }
export type BodyResponse<T extends Record<any, any> = Record<any, any>> = R<T>

export type SvelteResponse<T extends Record<any, any> = any> =
	'body' extends keyof T ? BodyResponse<T> : NoBodyResponse<T>
