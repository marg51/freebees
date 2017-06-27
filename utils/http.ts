import * as request from "request"
import * as jsonschema from "jsonschema"
import { get } from "lodash"

const fs = require("fs")

export default {
    createMatchers(promise: Promise<request.RequestCallback>) {
        const fns: Function[] = []

        return {
            expectStatus(status: number) {
                fns.push((received: any) => expect(received.response.statusCode).toBe(status))

                return this
            },
            expectHeaderContains(name: string, value: string) {
                fns.push((received: any) => it("should have header " + name, () => expect(received.response.headers[name]).toBe(value)))

                return this
            },
            expectHeader(name: string) {
                fns.push((received: any) => expect(received.response.headers[name]).toBeDefined())

                return this
            },
            expectJSONContains(path: string) {
                fns.push((received: any) => expect(received.body).toHaveProperty(path))

                return this
            },
            expectJSONMatchesObject(path: string, value: object) {
                fns.push((received: any) => expect(get(received.body, path)).toMatchObject(value))

                return this
            },
            expectBodyContains(value: string | RegExp) {
                fns.push((received: any) => {
                    let body = received.body

                    if (typeof body == "object")
                        body = JSON.stringify(body)

                    expect(body).toMatch(value)
                })

                return this
            },
            expectJSONSchema(schema: jsonschema.Schema) {
                // this.expectHeaderContains("content-type", "application/json")

                // fns.push(
                //     (received: any) => {
                //         const validation = jsonschema.validate(received.body, schema)

                //         expect(validation.errors.length).toBe(0)
                //     })

                return this
            },
            expectMaxResponseTime(time: number) {
                // time to download content is not included
                fns.push((received: any) => expect(received.response.timings.response).toBeLessThan(time))

                return this
            },
            expectMaxEndTime(time: number) {
                fns.push((received: any) => expect(received.response.timings.end).toBeLessThan(time))

                return this
            },
            // Duration of HTTP download (timings.end - timings.response)
            expectMaxDownloadTime(time: number) {
                fns.push((received: any) => expect(received.response.timingPhases.download).toBeLessThan(time))

                return this
            },
            go() {
                return promise.then((data) => {
                    return fns.map(fn => fn(data))
                })
            },
            expect(callback: Function) {
                fns.push(
                    (received: any) => expect(callback(received)).toBeTruthy()
                )

                return this
            },
            debug(callback: Function) {
                fns.push(callback)

                return this
            },
            printToFile(callback: Function, filename = "test.txt") {

                fns.push(
                    (received: any) => fs.writeFile(__dirname + "/" + filename, callback(received))
                )

                return this
            }
        }
    },
    get(url: any) {
        if (typeof url == "string")
            url = {
                url
            }


        const promise = new Promise((resolve, reject) => {
            request({
                ...url,
                time: true
            }, (error: any, response: request.RequestResponse, body: any) => {
                resolve({ error, response, body })
            })
        })

        return this.createMatchers(promise)
    }
}

