interface DefaultResponse {
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
type R<T extends Record<any, any> = Record<any, any>> = {
	[K in keyof DefaultResponse]: K extends keyof T ? NonNullable<T[K]> : NonNullable<DefaultResponse[K]>
}

type NoBodyResponse<T> = Omit<R<T>, 'body'> & { body?: any }
type BodyResponse<T> = R<T>

type SvelteResponse<T extends Record<any, any> = any> = 'body' extends keyof T ? BodyResponse<T> : NoBodyResponse<T>