import { Headers, RequestResponse } from "request"

export type Response = {
    body: {
        [key: string]: any
    }
    response: RequestResponse
    error: any
}
