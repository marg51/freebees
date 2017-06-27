# Free bees :bee:

Inspired by http://frisbyjs.com/, using jest and https://github.com/request/request

<img width="471" alt="screen shot 2017-06-27 at 12 20 50" src="https://user-images.githubusercontent.com/543507/27585472-52f7cc02-5b34-11e7-8573-b7456030ba33.png">


```javascript
describe("get comments", () => {
    Freebees
        // see https://github.com/request/request
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
        .expectBodyToMatchSnapshot()
        .it("expect body should have length 500", ({ body }) => {
            return expect(body.length).toBe(500)
        })

})
```


### debug queries

<img width="696" alt="screen shot 2017-06-27 at 12 21 49" src="https://user-images.githubusercontent.com/543507/27585477-5b988f04-5b34-11e7-8e27-9f6f97618aa9.png">