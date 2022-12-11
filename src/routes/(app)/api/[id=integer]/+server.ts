import type { API } from './$types'
import { Ok } from 'sveltekit-zero-api/http'

export function GET(requestEvent: API<any>) {
	requestEvent.request.json()
	return Ok()
}

export function POST(event: API<any>) {
	return Ok({
		body: {
			message: 'Hello World!'
		}
	})
} 