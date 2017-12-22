var mock = require("mock-require")

mock("../utils/http", {
    default: {
        get: function() {
            return {
                expectHttpStatus() {
                    return this
                },
                expectHeaderContains() {
                    return this
                },
                expectHeader() {
                    return this
                },
                expectJSONContains() {
                    return this
                },
                expectJSONMatchesObject() {
                    return this
                },
                expectBodyContains() {
                    return this
                },
                expectJSONSchema() {
                    return this
                },
                expectBodyToMatchSnapshot() {
                    return this
                },
                expectHeadersToMatchSnapshot() {
                    return this
                },
                expectToMatchSnapshot() {
                    return this
                },
                expectMaxResponseTime() {
                    return this
                },
                expectMaxEndTime() {
                    return this
                },
                expectMaxDownloadTime() {
                    return this
                },
                it() {
                    return this
                },
                debug() {
                    return this
                },
                printToFile() {
                    return this
                },
                showResponse() {
                    return this
                },
            }
        },
    },
})

global.describe = function(text: string, fn) {
    fn()
}

require("../demo/http.test.ts")
