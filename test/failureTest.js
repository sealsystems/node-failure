'use strict';

const assert = require('assertthat');

const failure = require('../lib/failure');

suite('fileupload.failure', () => {
  test('is a function', (done) => {
    assert.that(failure).is.ofType('function');
    done();
  });

  test('throws error if no message if given', (done) => {
    assert.that(() => {
      failure();
    }).is.throwing('Message is missing.');
    done();
  });

  test('throws error if code is not a number', (done) => {
    assert.that(() => {
      failure('asdf', 'huhu');
    }).is.throwing('Illegal data type, "code" should be number.');
    done();
  });

  test('returns SealError with default values', (done) => {
    const err = failure('huhu');

    assert.that(err).is.not.null();
    assert.that(err.name).is.equalTo('SealError');
    assert.that(err.message).is.equalTo('huhu');
    assert.that(err.code).is.equalTo(0);
    assert.that(err.metadata).is.equalTo({});
    done();
  });

  test('returns SealError with given values', (done) => {
    const err = failure(123, 'hopperla', { user: 'hugo' });

    assert.that(err).is.not.null();
    assert.that(err.name).is.equalTo('SealError');
    assert.that(err.message).is.equalTo('hopperla');
    assert.that(err.code).is.equalTo(123);
    assert.that(err.metadata).is.equalTo({ user: 'hugo' });
    done();
  });

  test('converts code of type string', (done) => {
    const err = failure('456', 'einstring');

    assert.that(err).is.not.null();
    assert.that(err.name).is.equalTo('SealError');
    assert.that(err.message).is.equalTo('einstring');
    assert.that(err.code).is.equalTo(456);
    assert.that(err.metadata).is.equalTo({});
    done();
  });

  test('has httpExport function', (done) => {
    assert.that(failure.httpExport).is.ofType('function');
    done();
  });

  test('httpExport exports plain object with properties', (done) => {
    const err = failure(123, 'hopperla', { user: 'hugo' });

    assert.that(failure.httpExport(err)).is.equalTo({
      message: 'hopperla',
      code: 123,
      metadata: {
        user: 'hugo'
      }
    });
    done();
  });

  test('has jsonHttpExport function', (done) => {
    assert.that(failure.jsonHttpExport).is.ofType('function');
    done();
  });

  test('jsonHttpExport exports JSON string with properties', (done) => {
    const err = failure(123, 'hopperla', { user: 'hugo' });

    assert.that(failure.jsonHttpExport(err)).is.equalTo(JSON.stringify({
      code: 123,
      message: 'hopperla',
      metadata: {
        user: 'hugo'
      }
    }));
    done();
  });

  test('has joinMeta function', (done) => {
    assert.that(failure.joinMeta).is.ofType('function');
    done();
  });

  test('joinMeta returns enhanced metadata', (done) => {
    const err = failure(123, 'hopperla', { user: 'hugo' });
    const meta = failure.joinMeta(err, {
      document: 'nixda'
    });

    assert.that(meta).is.equalTo({
      user: 'hugo',
      document: 'nixda'
    });
    done();
  });

  test('isFailure returns false for undefined values', (done) => {
    assert.that(failure.isFailure()).is.false();
    done();
  });

  test('isFailure returns false if name is not defined', (done) => {
    assert.that(failure.isFailure({})).is.false();
    done();
  });

  test('isFailure returns false if name is not SealError', (done) => {
    assert.that(failure.isFailure({ name: 'buhu' })).is.false();
    done();
  });

  test('isFailure returns false if code is node defined', (done) => {
    assert.that(failure.isFailure({ name: 'SealError' })).is.false();
    done();
  });

  test('isFailure returns true if value is a failure', (done) => {
    assert.that(failure.isFailure(failure(1, 'huhu'))).is.true();
    done();
  });
});
