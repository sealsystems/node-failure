'use strict';

const assert = require('assertthat');

const failure = require('../lib/failure');

suite('failure', () => {
  test('is a function', async () => {
    assert.that(failure).is.ofType('function');
  });

  test('throws error if no message if given', async () => {
    assert
      .that(() => {
        failure();
        throw new Error('X');
      })
      .is.throwing('Message is missing.');
  });

  test('throws error if code is not a number', async () => {
    assert
      .that(() => {
        failure('asdf', 'huhu');
        throw new Error('X');
      })
      .is.throwing('Illegal data type, "code" should be number.');
  });

  test('returns SealError with default values', async () => {
    const err = failure('huhu');

    assert.that(err).is.not.null();
    assert.that(err.name).is.equalTo('SealError');
    assert.that(err.message).is.equalTo('huhu');
    assert.that(err.code).is.equalTo(0);
    assert.that(err.metadata).is.equalTo({});
  });

  test('returns SealError with given values', async () => {
    const err = failure(123, 'hopperla', { user: 'hugo' });

    assert.that(err).is.not.null();
    assert.that(err.name).is.equalTo('SealError');
    assert.that(err.message).is.equalTo('hopperla');
    assert.that(err.code).is.equalTo(123);
    assert.that(err.metadata).is.equalTo({ user: 'hugo' });
  });

  test('converts code of type string', async () => {
    const err = failure('456', 'einstring');

    assert.that(err).is.not.null();
    assert.that(err.name).is.equalTo('SealError');
    assert.that(err.message).is.equalTo('einstring');
    assert.that(err.code).is.equalTo(456);
    assert.that(err.metadata).is.equalTo({});
  });

  test('has httpExport function', async () => {
    assert.that(failure.httpExport).is.ofType('function');
  });

  test('httpExport exports plain object with properties', async () => {
    const err = failure(123, 'hopperla', { user: 'hugo' });

    assert.that(failure.httpExport(err)).is.equalTo({
      message: 'hopperla',
      code: 123,
      metadata: {
        user: 'hugo'
      }
    });
  });

  test('has jsonHttpExport function', async () => {
    assert.that(failure.jsonHttpExport).is.ofType('function');
  });

  test('jsonHttpExport exports JSON string with properties', async () => {
    const err = failure(123, 'hopperla', { user: 'hugo' });

    assert.that(failure.jsonHttpExport(err)).is.equalTo(
      JSON.stringify({
        code: 123,
        message: 'hopperla',
        metadata: {
          user: 'hugo'
        }
      })
    );
  });

  test('has joinMeta function', async () => {
    assert.that(failure.joinMeta).is.ofType('function');
  });

  test('joinMeta returns enhanced metadata', async () => {
    const err = failure(123, 'hopperla', { user: 'hugo' });
    const meta = failure.joinMeta(err, {
      document: 'nixda'
    });

    assert.that(meta).is.equalTo({
      user: 'hugo',
      document: 'nixda'
    });
  });

  test('isFailure returns false for undefined values', async () => {
    assert.that(failure.isFailure()).is.false();
  });

  test('isFailure returns false if name is not defined', async () => {
    assert.that(failure.isFailure({})).is.false();
  });

  test('isFailure returns false if name is not SealError', async () => {
    assert.that(failure.isFailure({ name: 'buhu' })).is.false();
  });

  test('isFailure returns false if code is node defined', async () => {
    assert.that(failure.isFailure({ name: 'SealError' })).is.false();
  });

  test('isFailure returns true if value is a failure', async () => {
    assert.that(failure.isFailure(failure(1, 'huhu'))).is.true();
  });

  test('assert throws if error is not a failure', async () => {
    try {
      failure.assert(new Error('Throw Me'));
      throw new Error('X');
    } catch (errAssert) {
      assert.that(errAssert.message).is.equalTo('Throw Me');
    }
  });

  test('assert simply returns if error is a failure', async () => {
    failure.assert(failure(409, 'Do Not Throw This'));
  });
});
