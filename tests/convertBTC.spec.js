import chai, { expect } from 'chai';
import { describe, it, afterEach, beforeEach } from 'mocha';
import nock from 'nock';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chalk from 'chalk';
import convertBTC from '../src/convertBTC';

chai.use(sinonChai);

describe('ConvertBTC', () => {
  let consoleStub;

  const responseMock = {
    success: true,
    time: '2017-07-02 18:51:29',
    price: 2490.78,
  };

  beforeEach(() => {
    consoleStub = sinon.stub(console, 'info');
  });

  afterEach(() => {
    consoleStub.restore();
  });

  it('should use currency USD and 1 as amount default', async () => {
    nock('https://apiv2.bitcoinaverage.com')
      .get('/convert/global')
      .query({ from: 'BTC', to: 'USD', amount: 1 })
      .reply(200, responseMock);

    await convertBTC();
    expect(consoleStub).to.have.been.calledWith(`${chalk.red(1)} BTC to ${chalk.cyan('USD')} = ${chalk.yellow(2490.78)}`);
  });

  it('should use currency USD and 10 as amount', async () => {
    nock('https://apiv2.bitcoinaverage.com')
      .get('/convert/global')
      .query({ from: 'BTC', to: 'USD', amount: 10 })
      .reply(200, responseMock);

    await convertBTC('USD', 10);
    expect(consoleStub).to.have.been.calledWith(`${chalk.red(10)} BTC to ${chalk.cyan('USD')} = ${chalk.yellow(2490.78)}`);
  });

  it('should use currency BRL and 1 as amount default', async () => {
    nock('https://apiv2.bitcoinaverage.com')
      .get('/convert/global')
      .query({ from: 'BTC', to: 'BRL', amount: 1 })
      .reply(200, responseMock);

    await convertBTC('BRL');
    expect(consoleStub).to.have.been.calledWith(`${chalk.red(1)} BTC to ${chalk.cyan('BRL')} = ${chalk.yellow(2490.78)}`);
  });

  it('should message user when api reply with error', async () => {
    nock('https://apiv2.bitcoinaverage.com')
      .get('/convert/global')
      .query({ from: 'BTC', to: 'BRL', amount: 1 })
      .replyWithError('Error');

    await convertBTC('BRL');
    expect(consoleStub).to.have.been.calledWith(chalk.red('Something went wrong in the API. Try in a few minutes.'));
  });
});
