'use strict';

const assert = require('assertthat');

const failure = require('../lib/failure');

suite('failure', () => {
  test('is a function', async () => {
    assert.that(failure).is.ofType('function');
  });

  test('throws error if no message if given', async () => {
    assert.that(() => {
      failure();
      throw new Error('X');
    }).is.throwing('Message is missing.');
  });

  test('throws error if code is not a number', async () => {
    assert.that(() => {
      failure('asdf', 'huhu');
      throw new Error('X');
    }).is.throwing('Illegal data type, "code" should be number.');
  });

  test('returns SealError with default values', async () => {
    const err = failure('huhu');

    assert.that(err).is.not.null();
    assert.that(err.name).is.equalTo('SealError');
    assert.that(err.message).is.equalTo('huhu');
    assert.that(err.code).is.equalTo(0);
    assert.that(err.metadata).is.equalTo({
      kbcode: '@sealsystems/failure.undefined'
    });
  });

  test('returns SealError with all given values', async () => {
    const err = failure('hopperla', 123, { user: 'hugo' });

    assert.that(err).is.not.null();
    assert.that(err.name).is.equalTo('SealError');
    assert.that(err.message).is.equalTo('hopperla');
    assert.that(err.code).is.equalTo(123);
    assert.that(err.metadata).is.equalTo({
      user: 'hugo',
      kbcode: '@sealsystems/failure.undefined'
    });
  });

  test('returns SealError with given code only', async () => {
    const err = failure('hopperla2', 666);

    assert.that(err).is.not.null();
    assert.that(err.name).is.equalTo('SealError');
    assert.that(err.message).is.equalTo('hopperla2');
    assert.that(err.code).is.equalTo(666);
    assert.that(err.metadata).is.equalTo({
      kbcode: '@sealsystems/failure.undefined'
    });
  });

  test('returns SealError with given metadata only', async () => {
    const err = failure('hopperla3', { test: true });

    assert.that(err).is.not.null();
    assert.that(err.name).is.equalTo('SealError');
    assert.that(err.message).is.equalTo('hopperla3');
    assert.that(err.code).is.equalTo(0);
    assert.that(err.metadata).is.equalTo({
      test: true,
      kbcode: '@sealsystems/failure.undefined'
    });
  });

  test('returns SealError with kbcode from errors.js', async () => {
    const err = failure('Chainable object is missing.', { user: 'hansi' });

    assert.that(err).is.not.null();
    assert.that(err.name).is.equalTo('SealError');
    assert.that(err.message).is.equalTo('Chainable object is missing.');
    assert.that(err.code).is.equalTo(0);
    assert.that(err.metadata).is.equalTo({
      user: 'hansi',
      kbcode: '@sealsystems/failure.2'
    });
  });

  test('chains errors', async () => {
    const err1 = failure('Chainable object is missing.', { user: 'hansi' });
    const err2 = failure('Message is missing.').chain(err1);

    assert.that(err2.name).is.equalTo('SealError');
    assert.that(err2.message).is.equalTo('Message is missing.');
    assert.that(err2.code).is.equalTo(0);
    assert.that(err2.metadata).is.equalTo({
      kbcode: '@sealsystems/failure.1',
      cause: {
        code: 0,
        message: 'Chainable object is missing.',
        metadata: {
          user: 'hansi',
          kbcode: '@sealsystems/failure.2'
        }
      }
    });
  });

  test('throws error if no error object is given', async () => {
    assert.that(() => {
      failure('huhu').chain();
      throw new Error('X');
    }).is.throwing('Chainable object is missing.');
  });

  test('has httpExport function', async () => {
    assert.that(failure.httpExport).is.ofType('function');
  });

  test('httpExport exports plain object with properties', async () => {
    const err = failure('hopperla', 123, { user: 'hugo' });

    assert.that(failure.httpExport(err)).is.equalTo({
      message: 'hopperla',
      code: 123,
      metadata: {
        user: 'hugo',
        kbcode: '@sealsystems/failure.undefined'
      }
    });
  });

  test('has jsonHttpExport function', async () => {
    assert.that(failure.jsonHttpExport).is.ofType('function');
  });

  test('jsonHttpExport exports JSON string with properties', async () => {
    const err = failure('hopperla', 123, { user: 'hugo' });

    assert.that(failure.jsonHttpExport(err)).is.equalTo(JSON.stringify({
      code: 123,
      message: 'hopperla',
      metadata: {
        user: 'hugo',
        kbcode: '@sealsystems/failure.undefined'
      }
    }));
  });

  test('has joinMeta function', async () => {
    assert.that(failure.joinMeta).is.ofType('function');
  });

  test('joinMeta returns enhanced metadata', async () => {
    const err = failure('hopperla', 123, { user: 'hugo' });
    const meta = failure.joinMeta(err, {
      document: 'nixda'
    });

    assert.that(meta).is.equalTo({
      user: 'hugo',
      document: 'nixda',
      kbcode: '@sealsystems/failure.undefined'
    });
  });

  test('isFailure returns false for undefined values', async () => {
    assert.that(failure.isFailure()).is.false();
  });

  test('isFailure returns false if name is not defined', async () => {
    assert.that(failure.isFailure({})).is.false();
  });

  test('isFailure returns false if object is not inherited from SealFailure', async () => {
    assert.that(failure.isFailure({ name: 'SealError' })).is.false();
  });

  test('isFailure returns true if value is a failure generated SealError', async () => {
    assert.that(failure.isFailure(failure('huhu', 1))).is.true();
  });
});
