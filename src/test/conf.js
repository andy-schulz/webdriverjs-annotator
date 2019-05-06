exports.config = {
    seleniumAddress : "http://127.0.0.1:4444/wd/hub",

    capabilities: {
        browserName: "chrome"
    },

    jasmineNodeOpts: {
        // If true, display spec names.
        isVerbose: true,
        // If true, print colors to the terminal.
        showColors: true,
        // If true, include stack traces in failures.
//	    includeStackTrace: true,
        includeStackTrace: false,
        // Default time to wait in ms before a test fails.
        defaultTimeoutInterval: 1000,
        silent: false
    },

    params: {
        test: "test"
    }
}