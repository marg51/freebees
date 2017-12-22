import * as request from "request"
import * as jsonschema from "jsonschema"

import createMatchers from "./createMatchers"

export default {
    get(url: any) {
        if (typeof url == "string")
            url = {
                url,
            }

        const promise = new Promise((resolve, reject) => {
            request(
                {
                    ...url,
                    time: true,
                },
                (error: any, response: request.RequestResponse, body: any) => {
                    resolve({ error, response, body })
                }
            )
        })

        return createMatchers(promise, url)
    },
}
