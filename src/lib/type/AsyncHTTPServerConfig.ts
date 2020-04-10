/**
 * Configuration type
 */

import { RequestListener } from "http";

type AsyncHTTPServerConfig = {

    /**
     * Either the port or the path to the pipe
     */
    port: Number | string | undefined;

    /**
     * The handler (RequestHandler or any HTTP handler e.g. express application)
     */
    handler: RequestListener | undefined;
};

export default AsyncHTTPServerConfig;