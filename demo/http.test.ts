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
            url: "https://jsonplaceholder.typicode.com/comments?post_id=1",
            json: true
        })
        .expectStatus(200)
        .expectMaxResponseTime(1000)
        .expectMaxDownloadTime(5000)
        .expectMaxEndTime(6000) // end time = response + download
        .expectJSONMatchesObject({ id: 1 }, "0") // get first item, can be a path (ie. users.0.name )
        .expectBodyContains("Eliseo@gardner.biz")
        .expectBodyContains(/@sydney.com/)
        .it("expect body should have length 500", ({ body }) => {
            return expect(body.length).toBe(500)
        })

})
