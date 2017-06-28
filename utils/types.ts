import { Headers } from "request"

export type Response = {
    body: object,
    response: {
        headers: Headers
        statusCode: number
        timingPhases: {
            download: number
        }
        timings: {
            end: number
            download: number
            response: number
        }
    },
    error: any
}