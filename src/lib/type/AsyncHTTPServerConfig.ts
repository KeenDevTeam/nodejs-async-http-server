/**
 * Configuration type
 */

import { RequestListener } from 'http';

type AsyncHTTPServerConfig = {

    /**
     * Hostname/IP address your server binds to
     */
    host?: string;

    /**
     * Either the port or the path to the pipe
     */
    port?: Number | string;

    /**
     * The handler (RequestHandler or any HTTP handler e.g. express application)
     */
    handler?: RequestListener;
};

export default AsyncHTTPServerConfig;