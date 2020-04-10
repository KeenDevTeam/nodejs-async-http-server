/**
 * Library index
 */

import AsyncHTTPServerConfig from './type/AsyncHTTPServerConfig';
import { Server, createServer } from 'http';

const createConfigObject = (classConfig: AsyncHTTPServerConfig | undefined, userConfig: AsyncHTTPServerConfig | undefined): AsyncHTTPServerConfig => {

    if (!classConfig && !userConfig) {
        throw new Error('No configuration has been provided.');
    }

    if (!userConfig?.port && !classConfig?.port) {
        throw new Error('No port/pipe is defined in the config');
    }

    if (!userConfig?.handler && !classConfig?.handler) {
        throw new Error('No handler is defined in the config');
    }

    return {
        port: userConfig?.port || classConfig?.port,
        handler: userConfig?.handler || classConfig?.handler
    };
};

class AsyncHTTPServer {

    private readonly config: AsyncHTTPServerConfig | undefined;
    private server: Server | null = null;
    private started: boolean = false;

    constructor(config: AsyncHTTPServerConfig | undefined) {

        // attach config to the class
        this.config = config;
    }

    /**
     * Start server
     * @param config Configuration object to override the default settings
     */
    public start(config: AsyncHTTPServerConfig | undefined): Promise<AsyncHTTPServer> {

        return new Promise<AsyncHTTPServer>((resolve, reject) => {

            try {

                if (this.started) {
                    throw new Error('Server has been already started.');
                }

                // merge configurations
                const serverConfig: AsyncHTTPServerConfig = createConfigObject(this.config, config);
                this.server = createServer(serverConfig.handler);

                this.server.listen(serverConfig.port);
                this.server.once('listening', () => {

                    this.server?.removeAllListeners('error');
                    this.started = true;
                    return resolve()
                });

                this.server.once('error', (err: any) => {

                    this.server?.removeAllListeners('listening');
                    // reject the promise
                    return reject(err);
                });
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
                    throw new Error('Server is not started');
                }

                this.server.close(err => {

                    if (err) {

                        return reject(err);
                    }

                    this.started = false;
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