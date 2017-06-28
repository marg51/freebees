import { get } from "lodash"
import * as request from "request"
import { Response } from "./types"
const fs = require("fs")

const Table = require('cli-table')
const prettyjson = require('prettyjson')

export default function createMatchers(promise: Promise<Response>) {
    const fns: Function[] = []

    return {
        expectStatus(status: number) {
            describe("query", () =>
                it("expect http status to be " + status, () => {
                    return promise.then((received: Response) => expect(received.response.statusCode).toBe(status))
                })
            )

            return this
        },
        expectHeaderContains(name: string, value: string) {
            describe("headers", () =>
                it(`expect ${name} to contain ${value}`, () => {
                    return promise.then((received: Response) => it("should have header " + name, () => expect(received.response.headers[name]).toBe(value)))
                })
            )

            return this
        },
        expectHeader(name: string) {
            describe("headers", () =>
                it(`expect ${name} to be defined`, () => {
                    return promise.then((received: Response) => expect(received.response.headers[name]).toBeDefined())
                })
            )

            return this
        },
        expectJSONContains(path: string) {
            describe("body", () =>
                it(`to have property ${path}`, () => {

                    return promise.then((received: Response) => expect(received.body).toHaveProperty(path))
                })
            )

            return this
        },
        expectJSONMatchesObject(value: object, path?: string, ) {
            describe("body", () =>
                it(`${path ? "." + path : null} to match {${Object.keys(value).map(key => `${key}: ${value[key]}`)[0]}, ...})`, () => {

                    return promise.then((received: Response) => {
                        let body = received.body

                        if (path) body = get(received.body, path)

                        expect(body).toMatchObject(value)
                    })
                })
            )

            return this
        },
        expectBodyContains(value: string | RegExp) {
            describe("body", () =>
                it(`should contain ${value}`, () => {

                    return promise.then((received: Response) => {
                        let body: any = received.body

                        if (typeof body == "object")
                            body = JSON.stringify(body)

                        expect(body).toMatch(value)
                    })
                })
            )

            return this
        },
        expectJSONSchema(schema: jsonschema.Schema) {
            // this.expectHeaderContains("content-type", "application/json")

            // return promise.then(
            //     (received: Response) => {
            //         const validation = jsonschema.validate(received.body, schema)

            //         expect(validation.errors.length).toBe(0)
            //     })

            return this
        },
        expectBodyToMatchSnapshot() {
            describe("body", () =>
                it("should match snapshot", () =>
                    promise.then(({ body }) => expect(body).toMatchSnapshot())
                )
            )

            return this
        },
        expectHeadersToMatchSnapshot() {
            describe("headers", () =>
                it("should match snapshot", () =>
                    promise.then(({ response }) => expect(response.headers).toMatchSnapshot())
                )
            )

            return this
        },
        expectToMatchSnapshot() {
            describe("query", () =>
                it("should match snapshot", () =>
                    promise.then((received) => expect({
                        statusCode: received.response.statusCode,
                        headers: received.response.headers,
                        body: received.body
                    }).toMatchSnapshot())
                )
            )

            return this
        },
        expectMaxResponseTime(time: number) {
            describe("query", () =>
                it(`expect response time to be less than ${time}`, () => {
                    // time to download content is not included
                    return promise.then((received: Response) => expect(received.response.timings.response).toBeLessThan(time))
                })
            )

            return this
        },
        expectMaxEndTime(time: number) {
            describe("query", () =>
                it(`expect total time to be less than ${time}`, () => {
                    return promise.then((received: Response) => expect(received.response.timings.end).toBeLessThan(time))
                })
            )

            return this
        },
        // Duration of HTTP download (timings.end - timings.response)
        expectMaxDownloadTime(time: number) {
            describe("query", () =>
                it(`expect download time to be less than ${time}`, () => {
                    return promise.then((received: Response) => expect(received.response.timingPhases.download).toBeLessThan(time))
                })
            )

            return this
        },
        it(name: string, callback: Function) {
            describe("custom", () =>
                it(name, () => {
                    return promise.then(
                        (received: Response) => callback(received)
                    )
                })
            )

            return this
        },
        debug(callback: Function) {
            promise.then((received: Response) => callback(received))

            return this
        },
        printToFile(callback: Function, filename = "test.txt") {
            describe("debug", () =>
                it(`prints to file ${__dirname + "/" + filename}`, () => {
                    return promise.then(
                        (received: Response) => fs.writeFile(__dirname + "/" + filename, callback(received))
                    )
                })
            )


            return this
        },
        showResponse() {
            describe("debug", () =>
                it("show response", () => {
                    return promise.then(
                        (received: Response) => {

                            const table = createTableFromObject(received.response.headers)
                            console.log(table.toString());

                            console.log(prettyjson.render(received.body))
                        }
                    )
                })
            )

            return this
        }
    }
}

function createTableFromObject(object: object) {
    const table = new Table()
    const keys = Object.keys(object)
    const objects = keys.map((key: string) => ({ [key]: object[key] }))

    table.push(...objects);

    return table
}