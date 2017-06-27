import { get } from "lodash"
import * as request from "request"
const fs = require("fs")

const Table = require('cli-table')
const prettyjson = require('prettyjson')

export default function createMatchers(promise: Promise<request.RequestCallback>) {
    const fns: Function[] = []

    return {
        expectStatus(status: number) {
            it("expect http status to be " + status, () => {
                return promise.then((received: any) => expect(received.response.statusCode).toBe(status))
            })

            return this
        },
        expectHeaderContains(name: string, value: string) {
            it(`expect header ${name} to contain ${value}`, () => {
                return promise.then((received: any) => it("should have header " + name, () => expect(received.response.headers[name]).toBe(value)))
            })

            return this
        },
        expectHeader(name: string) {
            it(`expect header ${name} to be defined`, () => {
                return promise.then((received: any) => expect(received.response.headers[name]).toBeDefined())
            })
            return this
        },
        expectJSONContains(path: string) {
            it(`expect body to have property ${path}`, () => {

                return promise.then((received: any) => expect(received.body).toHaveProperty(path))
            })

            return this
        },
        expectJSONMatchesObject(path: string, value: object) {
            it(`expect body.${path} to match {${Object.keys(value).map(key => `${key}: ${value[key]}`)[0]}, ...})`, () => {
                return promise.then((received: any) => expect(get(received.body, path)).toMatchObject(value))
            })
            return this
        },
        expectBodyContains(value: string | RegExp) {
            it(`expect body to contain ${value}`, () => {

                return promise.then((received: any) => {
                    let body = received.body

                    if (typeof body == "object")
                        body = JSON.stringify(body)

                    expect(body).toMatch(value)
                })
            })

            return this
        },
        expectJSONSchema(schema: jsonschema.Schema) {
            // this.expectHeaderContains("content-type", "application/json")

            // return promise.then(
            //     (received: any) => {
            //         const validation = jsonschema.validate(received.body, schema)

            //         expect(validation.errors.length).toBe(0)
            //     })

            return this
        },
        expectMaxResponseTime(time: number) {
            it(`expect response time to be less than ${time}`, () => {

                // time to download content is not included
                return promise.then((received: any) => expect(received.response.timings.response).toBeLessThan(time))
            })

            return this
        },
        expectMaxEndTime(time: number) {
            it(`expect total time to be less than ${time}`, () => {
                return promise.then((received: any) => expect(received.response.timings.end).toBeLessThan(time))
            })
            return this
        },
        // Duration of HTTP download (timings.end - timings.response)
        expectMaxDownloadTime(time: number) {
            it(`expect download time to be less than ${time}`, () => {

                return promise.then((received: any) => expect(received.response.timingPhases.download).toBeLessThan(time))
            })

            return this
        },
        expect(callback: Function) {
            it(`expect ${callback.toString()
                .replace("\n", " ")
                .replace(/ {2,}/g, "  ")
                .slice(0, 50)}...`
                , () => {
                    return promise.then(
                        (received: any) => expect(callback(received)).toBeTruthy()
                    )
                })

            return this
        },
        debug(callback: Function) {
            return promise.then(callback)

            return this
        },
        printToFile(callback: Function, filename = "test.txt") {
            it(`prints to file ${__dirname + "/" + filename}`, () => {
                return promise.then(
                    (received: any) => fs.writeFile(__dirname + "/" + filename, callback(received))
                )
            })


            return this
        },
        showResponse() {
            it("show response", () => {
                return promise.then(
                    (received: any) => {

                        const table = createTableFromObject(received.response.headers)
                        console.log(table.toString());

                        console.log(prettyjson.render(received.body))
                    }
                )
            })

            return this
        }
    }
}

function createTableFromObject(object: object) {
    const table = new Table();
    const keys = Object.keys(object)
    const objects = keys.map((key: string) => ({ [key]: object[key] }))

    table.push(...objects);

    return table
}