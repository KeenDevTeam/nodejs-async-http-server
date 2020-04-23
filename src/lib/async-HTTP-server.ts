/**
 * Library index
 */

import AsyncHTTPServerConfig from './type/async-HTTP-server-config';
import { Server, createServer } from 'http';
import { ListenOptions } from 'net';

const createConfigObject = (classConfig?: AsyncHTTPServerConfig, userConfig?: AsyncHTTPServerConfig): AsyncHTTPServerConfig => {

    if (!classConfig && !userConfig) {
        throw new Error('No configuration has been provided.');
    }

    if (!userConfig?.port && !classConfig?.port) {
        throw new Error('No port/pipe is defined in the config.');
    }

    if (!userConfig?.handler && !classConfig?.handler) {
        throw new Error('No handler is defined in the config.');
    }

    return {
        host: userConfig?.host || classConfig?.host,
        port: userConfig?.port || classConfig?.port,
        handler: userConfig?.handler || classConfig?.handler
    };
};

class AsyncHTTPServer {

    private readonly config?: AsyncHTTPServerConfig;
    private server?: Server;
    private started: boolean = false;

    constructor(config?: AsyncHTTPServerConfig) {

        // attach config to the class
        this.config = config;
    }

    /**
     * Is the server running
     */
    get isRunning() { return this.started; }

    /**
     * Get HTTP server instance
     */
    get HttpServer() { return this.server; }

    /**
     * Start server
     * @param config Configuration object to override the default settings
     */
    public start(config?: AsyncHTTPServerConfig): Promise<AsyncHTTPServer> {

        return new Promise<AsyncHTTPServer>((resolve, reject) => {

            try {

                if (this.started) {
                    return reject(new Error('Server has been already started.'));
                }

                // merge configurations
                const serverConfig: AsyncHTTPServerConfig = createConfigObject(this.config, config);
                this.server = createServer(serverConfig.handler);

                // bind events
                this.server.once('listening', () => {

                    this.server?.removeAllListeners('error');
                    this.server?.removeAllListeners('listening');
                    this.started = true;

                    return resolve(this);
                });

                this.server.once('error', (err: any) => {

                    this.server?.removeAllListeners('listening');
                    this.server?.removeAllListeners('error');

                    return reject(err);
                });

                // try to start the server

                const listenOptions: ListenOptions = {};

                // TCP/IP endpoint
                if (typeof serverConfig.port === 'number') {

                    listenOptions.host = serverConfig.host;
                    listenOptions.port = serverConfig.port;
                }

                // unix socket or windows pipe
                if (typeof serverConfig.port === 'string') {

                    listenOptions.path = serverConfig.port as string;
                }

                // start server
                this.server.listen(listenOptions);
            }
            catch (err) {

                return reject(err);
            }
        });
    }

    /**
     * Stop current instance of the server
     */
    public stop(): Promise<void> {

        return new Promise<void>((resolve, reject) => {

            try {

                if (!this.started || !this.server) {
                    this.started = false;
                    this.server = undefined;
                    return reject(new Error('Server is not started'));
                }

                this.server.close(err => {

                    if (err) { return reject(err); }

                    this.started = false;
                    this.server = undefined;

                    return resolve();
                });
            }
            catch (err) {

                return reject(err);
            }
        });
    }
}

export default AsyncHTTPServer;