# Free bees :bee:

Inspired by http://frisbyjs.com/, using jest and https://github.com/request/request

```bash
npm install freebees
```

<img width="471" alt="screen shot 2017-06-27 at 12 20 50" src="https://user-images.githubusercontent.com/543507/27585472-52f7cc02-5b34-11e7-8573-b7456030ba33.png">

```javascript
Freebees
    // see https://github.com/request/request
    .get({
        url: "https://jsonplaceholder.typicode.com/comments",
        json: true,
    })
    .expectStatus(200)
    .expectMaxResponseTime(500)
    .expectMaxDownloadTime(1500)
    .expectMaxEndTime(2000) // end time = response + download
    .expectJSONMatchesObject({ id: 1 }, "0") // get first item, can be a path (ie. users.0.name )
    .expectBodyContains("Eliseo@gardner.biz")
    .expectBodyContains(/@sydney.com/)
    .expectBodyToMatchSnapshot()
    .expectBodyToMatchSchema({
        type: "array",
        items: {
            properties: {
                email: { type: "object" },
            },
            required: ["email"],
        },
    })
    .it("expect body should have length 500", ({ body }) => {
        return expect(body.length).toBe(500)
    })
```

### getting started

```bash
npm install --save freebees jest
```

update your `package.json`'s _scripts.test_ value to `jest`:

```json
{
    "scripts": {
        "test": "jest"
    }
}
```

create a new file `http.test.js`

```js
var freebees = require("freebees")
const http = freebees.default.http

// or

import { http } from "freebees"

http.get({
    url: "https://jsonplaceholder.typicode.com/posts/1",
    json: true,
})
    .expectHeader("x-powered-by")
    .expectHeaderContains("content-type", "application/json")
    .expectJSONContains("userId")
    .expectJSONMatchesObject({ id: 1 })
```

`npm t` to run the tests
