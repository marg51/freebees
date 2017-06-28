import { get } from "lodash"
import * as request from "request"
import { Response } from "./types"
const fs = require("fs")

const Table = require('cli-table')
const prettyjson = require('prettyjson')

export default function createMatchers(promise: Promise<Response>) {
    const fns: Function[] = []

    const test = createTest(promise)

    return {
        expectStatus(status: number) {
            test(
                "query",
                "expect http status to be " + status,
                (received: Response) => expect(received.response.statusCode).toBe(status)
            )

            return this
        },
        expectHeaderContains(name: string, value: string) {
            test(
                "headers",
                `expect ${name} to contain ${value}`,
                (received: Response) => it("should have header " + name, () => expect(received.response.headers[name]).toBe(value))
            )

            return this
        },
        expectHeader(name: string) {
            test(
                "headers",
                `expect ${name} to be defined`,
                (received: Response) => expect(received.response.headers[name]).toBeDefined()
            )

            return this
        },
        expectJSONContains(path: string) {
            test(
                "body",
                `to have property ${path}`,
                (received: Response) => expect(received.body).toHaveProperty(path)
            )

            return this
        },
        expectJSONMatchesObject(value: any, path?: string, ) {
            test(
                "body",
                `${path ? "." + path : null} to match {${Object.keys(value).map(key => `${key}: ${value[key]}`)[0]}, ...})`,
                (received: Response) => {
                    let body = received.body

                    if (path) body = get(received.body, path)

                    expect(body).toMatchObject(value)
                }
            )

            return this
        },
        expectBodyContains(value: string | RegExp) {
            test(
                "body",
                `should contain ${value}`,
                (received: Response) => {
                    let body: any = received.body

                    if (typeof body == "object")
                        body = JSON.stringify(body)

                    expect(body).toMatch(value)
                }
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
            test(
                "body",
                "should match snapshot",
                ({ body }) => expect(body).toMatchSnapshot()
            )

            return this
        },
        expectHeadersToMatchSnapshot() {
            test(
                "headers",
                "should match snapshot",
                ({ response }) => expect(response.headers).toMatchSnapshot()
            )

            return this
        },
        expectToMatchSnapshot() {
            test(
                "query",
                "should match snapshot",
                (received) => expect({
                    statusCode: received.response.statusCode,
                    headers: received.response.headers,
                    body: received.body
                }).toMatchSnapshot()
            )

            return this
        },
        expectMaxResponseTime(time: number) {
            test(
                "query",
                `expect response time to be less than ${time}`,
                // time to download content is not included
                (received: Response) => expect(received.response.timings.response).toBeLessThan(time)
            )

            return this
        },
        expectMaxEndTime(time: number) {
            test(
                "query",
                `expect total time to be less than ${time}`,
                (received: Response) => expect(received.response.timings.end).toBeLessThan(time)
            )

            return this
        },
        // Duration of HTTP download (timings.end - timings.response)
        expectMaxDownloadTime(time: number) {
            test(
                "query",
                `expect download time to be less than ${time}`,
                (received: Response) => expect(received.response.timingPhases.download).toBeLessThan(time)
            )

            return this
        },
        it(name: string, callback: Function) {
            test(
                "custom",
                name,
                callback
            )

            return this
        },
        debug(callback: Function) {
            promise.then((received: Response) => callback(received))

            return this
        },
        printToFile(callback: Function, filename = "test.txt") {
            test(
                "debug",
                `prints to file ${__dirname + "/" + filename}`,
                (received: Response) => fs.writeFile(__dirname + "/" + filename, callback(received))
            )


            return this
        },
        showResponse() {
            test(
                "debug",
                "show response",
                (received: Response) => {
                    const table = createTableFromObject(received.response.headers)
                    console.log(table.toString());

                    console.log(prettyjson.render(received.body))
                }
            )

            return this
        }
    }
}

function createTest(promise: Promise<Response>) {

    return (type: string, name: string, callback: Function) =>
        describe(type, () =>
            it(name, () =>
                promise.then(
                    (received: Response) => callback(received)
                )
            )
        )
}

function createTableFromObject(object: any) {
    const table = new Table()
    const keys = Object.keys(object)
    const objects = keys.map((key: string) => ({ [key]: object[key] }))

    table.push(...objects);

    return table
}