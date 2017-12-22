import Freebees from "../utils/http"

describe("Test jsonplaceholder.typicode.com endpoints", () => {
    Freebees.get({
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

    Freebees.get({
        url: "https://jsonplaceholder.typicode.com/comments?post_id=1",
        json: true,
    })
        .expectHttpStatus(200)
        .expectMaxResponseTime(1000)
        .expectMaxDownloadTime(5000)
        .expectMaxEndTime(6000) // end time = response + download
        .expectJSONMatchesObject({ id: 1 }, "0") // get first item, can be a path (ie. users.0.name )
        .expectBodyContains("Eliseo@gardner.biz")
        .expectBodyContains(/@sydney.com/)
        .it("expect body to have length of 500", ({ body }) => {
            return expect(body.length).toBe(500)
        })
})
