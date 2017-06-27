import Freebees from "../utils/http"

describe("get POST 1", () => {
    Freebees
        .get({
            url: "https://jsonplaceholder.typicode.com/posts/1",
            // method: "GET",
            json: true,
            // body: { },
            // headers: {
            //     Authorization: "..."
            // }
        })
        // .showResponse()
        .expectHeader("x-powered-by")
        .expectHeaderContains("content-type", "application/json")
        .expectJSONContains("userId")
        .expectJSONMatchesObject({ id: 1 })
        .expectBodyToMatchSnapshot()
    // .expectHeadersToMatchSnapshot()
    // .expectToMatchSnapshot()
})

describe("get comments", () => {
    Freebees
        .get({
            url: "https://jsonplaceholder.typicode.com/comments",
            json: true
        })
        .expectStatus(200)
        .expectMaxResponseTime(500)
        .expectMaxDownloadTime(1500)
        .expectMaxEndTime(2000) // end time = response + download
        .expectJSONMatchesObject({ id: 1 }, "0") // get first item, can be a path (ie. users.0.name )
        .expectBodyContains("Eliseo@gardner.biz")
        .expectBodyContains(/@sydney.com/)
        .it("expect body should have length 500", ({ body }) => {
            return expect(body.length).toBe(500)
        })

})
