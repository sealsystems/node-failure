'use strict';

const createError = function(code, message, metadata) {
  const err = new Error(message);

  err.name = 'SealError';
  err.code = code;
  err.metadata = Object.assign({}, metadata);

  return err;
};

const failure = function(code, message, metadata) {
  if (!message) {
    message = code;
    code = 0;
  }
  if (!message) {
    throw createError(0, 'Message is missing.');
  }
  if (typeof code !== 'number') {
    code = parseInt(code, 10);
    if (isNaN(code)) {
      throw createError(0, 'Illegal data type, "code" should be number.', { code, type: typeof code });
    }
  }

  return createError(code, message, metadata);
};

failure.joinMeta = function(sealError, metadata) {
  return Object.assign({}, sealError.metadata, metadata);
};

failure.httpExport = function(sealError) {
  return {
    code: sealError.code,
    message: sealError.message,
    metadata: sealError.metadata
  };
};

failure.jsonHttpExport = function(sealError) {
  return JSON.stringify(failure.httpExport(sealError));
};

failure.isFailure = function(error) {
  return error !== undefined && error.name === 'SealError' && Object.prototype.hasOwnProperty.call(error, 'code');
};

failure.assert = function(error) {
  if (!failure.isFailure(error)) {
    throw error;
  }
};

module.exports = failure;
