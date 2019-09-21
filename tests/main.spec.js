import { expect } from 'chai';
import { it, describe } from 'mocha';

import { exec } from 'child_process';

const btcConverter = './src/main.js';

describe('Main CLI', () => {
  it('should return Hello World', (done) => {
    exec(btcConverter, (err, stdout, stderr) => {
      if (err) throw err;

      expect(stdout.replace('\n', '')).to.be.equal('Hello World!');

      done();
    });
  });
});
