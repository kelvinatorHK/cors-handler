'use strict';

const defaultOptions = {
    origins: [], // if left blank then all domains will be allowed
    // origins: ["https://www.nuskin.com", "https://test.nuskin.com", "https://dev.nuskin.com"],
    allowCredentials: false,
    allowMethod: null,
    maxAge: null
};

/**
 * cors is a function to return a new function which will put the CORS headers in the res.
 *
 * @param {Object} the original handler function that does NOT have CORS headers in the callback res
 * @return {Object} a new handler function that will wrap the CORS headers
 */
function cors(handler, _options) {
    return (event, context, callback) =>
        handler(event, context, (err, res) => {
            let options;
            if (_options) {
                // deep copy
                options = JSON.parse(JSON.stringify(defaultOptions));
                for (let prop in _options) {
                    if (_options.hasOwnProperty(prop)) {
                        options[prop] = _options[prop];
                    }
                }
            } else {
                options = defaultOptions;
            }
            console.log('In index, options = ', options);

            if (options.origins.length > 0) {
                console.log("Inside length....");
                let matchedCORS = options.origins
                    .map((o) => o.trim())
                    .filter((o) => o === event.headers.origin);

                if (matchedCORS.length > 0) {
                    res.headers = res.headers || {};
                    if (!!options.maxAge) {
                        res.headers['Access-Control-Max-Age'] = options.maxAge;
                    }
                    res.headers['Access-Control-Allow-Headers'] =
                        options.allowMethod ?
                            options.allowMethod.join(',')
                            : 'GET,HEAD,PUT,PATCH,POST,DELETE';
                    res.headers['Access-Control-Allow-Credentials'] =
                        JSON.stringify(!!options.allowCredentials);
                    res.headers['Access-Control-Allow-Origin'] =
                        event.headers.origin;
                }
            } else {
                res.headers = res.headers || {};
                if (!!options.maxAge) {
                    res.headers['Access-Control-Max-Age'] = options.maxAge;
                }
                res.headers['Access-Control-Allow-Headers'] =
                    options.allowMethod ?
                        options.allowMethod.join(',')
                        : 'GET,HEAD,PUT,PATCH,POST,DELETE';
                res.headers['Access-Control-Allow-Credentials'] =
                    JSON.stringify(!!options.allowCredentials);
                res.headers['Access-Control-Allow-Origin'] = '*';
            };
            callback(null, res);
        });
}

module.exports = {
    cors: cors
};
