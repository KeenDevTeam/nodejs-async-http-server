/**
 * Tests entry point
 */

import { RequestListener } from 'http';

import 'mocha';
import { expect } from 'chai';
import { checkPortStatus, findAPortNotInUse } from 'portscanner';
import axios from 'axios';

import AsyncHTTPServer from '../src';

const handler: RequestListener = (req, res) => {
    res.statusCode = 204;
    res.end();
};

const handler2: RequestListener = (req, res) => {
    res.statusCode = 200;
    res.end();
};

describe('SpeedUP|Async HTTP Server', () => {

    describe('constructor', () => {

        it('should create a new instance without any config', () => {
            new AsyncHTTPServer();
        });
    });

    describe('start', () => {

        describe('createConfigObject()', () => {

            it('should raise an error in case of config absence', async () => {

                try {
                    const instance = new AsyncHTTPServer();
                    await instance.start();
                    throw new Error('Unexpected');
                }
                catch (err) {
                    expect(err).to.have.property('message').that.is.eq('No configuration has been provided.');
                }
            });

            it('should raise an error in case of config.port absence', async () => {

                try {
                    const instance = new AsyncHTTPServer({});
                    await instance.start({});
                    throw new Error('Unexpected');
                }
                catch (err) {
                    expect(err).to.have.property('message').that.is.eq('No port/pipe is defined in the config.');
                }
            });

            it('should raise an error in case of config.handler absence (port in class config)', async () => {

                try {
                    const instance = new AsyncHTTPServer({
                        port: 3000
                    });
                    await instance.start();
                    throw new Error('Unexpected');
                }
                catch (err) {
                    expect(err).to.have.property('message').that.is.eq('No handler is defined in the config.');
                }
            });

            it('should raise an error in case of config.handler absence (port in method config)', async () => {

                try {
                    const instance = new AsyncHTTPServer({});
                    await instance.start({
                        port: 3000
                    });
                    throw new Error('Unexpected');
                }
                catch (err) {
                    expect(err).to.have.property('message').that.is.eq('No handler is defined in the config.');
                }
            });
        });

        it('should start normally on a random port from constructor', async () => {

            const port = await findAPortNotInUse(5000, 9000);

            const instance = new AsyncHTTPServer({
                port,
                handler
            });
            expect(instance.isRunning).to.be.eq(false);

            await instance.start();
            expect(instance.isRunning).to.be.eq(true);
            let portStatus = await checkPortStatus(port);
            expect(portStatus).to.be.eq('open');

            // perform an HTTP request
            const httpResponse = await axios.get(`http://localhost:${port}`);

            expect(httpResponse.status).to.be.eq(204);

            await instance.stop();
            portStatus = await checkPortStatus(port);
            expect(portStatus).to.be.eq('closed');
        });

        it('should start normally on a random port from start method', async () => {

            const constructorPort = await findAPortNotInUse(5000, 5500);

            const instance = new AsyncHTTPServer({
                port: constructorPort,
                handler
            });
            expect(instance.isRunning).to.be.eq(false);

            const methodPort = await findAPortNotInUse(5501, 6000);

            await instance.start({
                port: methodPort
            });

            expect(instance.isRunning).to.be.eq(true);

            let portStatus = await checkPortStatus(constructorPort);
            expect(portStatus).to.be.eq('closed');

            portStatus = await checkPortStatus(methodPort);
            expect(portStatus).to.be.eq('open');

            // perform an HTTP request
            const httpResponse = await axios.get(`http://localhost:${methodPort}`);

            expect(httpResponse.status).to.be.eq(204);

            await instance.stop();
            portStatus = await checkPortStatus(methodPort);
            expect(portStatus).to.be.eq('closed');
        });

        it('should start normally on a random port with different handler', async () => {

            const port = await findAPortNotInUse(5000, 9000);

            const instance = new AsyncHTTPServer({
                port,
                handler
            });
            expect(instance.isRunning).to.be.eq(false);

            await instance.start({
                handler: handler2
            });
            expect(instance.isRunning).to.be.eq(true);
            let portStatus = await checkPortStatus(port);
            expect(portStatus).to.be.eq('open');

            // perform an HTTP request
            const httpResponse = await axios.get(`http://localhost:${port}`);

            expect(httpResponse.status).to.be.eq(200);

            await instance.stop();
            portStatus = await checkPortStatus(port);
            expect(portStatus).to.be.eq('closed');
        });

        it('should throw error if the server has been already started', async () => {

            const port = await findAPortNotInUse(5000, 9000);

            const instance = new AsyncHTTPServer({
                port,
                handler
            });
            expect(instance.isRunning).to.be.eq(false);

            await instance.start();
            expect(instance.isRunning).to.be.eq(true);
            let portStatus = await checkPortStatus(port);
            expect(portStatus).to.be.eq('open');

            try {

                await instance.start();
                throw new Error('UnexpectedError');
            }
            catch (err) {

                expect(err).to.have.property('message').that.is.eq('Server has been already started.');
            }
            finally {

                await instance.stop();
                portStatus = await checkPortStatus(port);
                expect(portStatus).to.be.eq('closed');
            }
        });

        it('should throw error if the port has been already opened', async () => {

            const port = await findAPortNotInUse(5000, 9000);

            const instance1 = new AsyncHTTPServer({
                port,
                handler
            });
            expect(instance1.isRunning).to.be.eq(false);

            await instance1.start();
            expect(instance1.isRunning).to.be.eq(true);
            let portStatus = await checkPortStatus(port);
            expect(portStatus).to.be.eq('open');


            const instance2 = new AsyncHTTPServer({
                port,
                handler
            });
            expect(instance2.isRunning).to.be.eq(false);

            try {

                await instance2.start();
                throw new Error('UnexpectedError');
            }
            catch (err) {

                expect(err).to.have.property('message').that.is.not.eq('UnexpectedError');
            }
            finally {

                await instance1.stop();
                portStatus = await checkPortStatus(port);
                expect(portStatus).to.be.eq('closed');
            }
        });
    });

    describe('stop()', () => {

        it('should throw error if the server has not been started yet', async () => {

            try {
                const instance = new AsyncHTTPServer();
                await instance.stop();
                throw new Error('Unexpected');
            }
            catch (err) {
                expect(err).to.have.property('message').that.is.eq('Server is not started');
            }
        });
    });
});