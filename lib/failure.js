'use strict';

const path = require('path');
const tracker = require('v8-callsites');

const errorsMap = {
  '.': require('./errors.js')
};

const plain = function (sealError) {
  return {
    code: sealError.code || 0,
    message: sealError.message,
    metadata: sealError.metadata || {}
  };
};

class SealError extends Error {
  constructor (module, message, code, metadata) {
    super(message);

    this.name = 'SealError';
    this.code = code;
    this.metadata = metadata;
    if (module && errorsMap[module]) {
      const kbCode = typeof errorsMap[module][message] === 'object' ?
        errorsMap[module][message].code :
        errorsMap[module][message];

      this.metadata.kbcode = `${module}.${kbCode}`;
    }
  }

  chain (previousError) {
    if (!previousError) {
      throw new SealError('.', 'Chainable object is missing.', 0, {});
    }
    this.metadata.cause = plain(previousError);

    return this;
  }
}

const failure = function (message, code = 0, metadata = {}) {
  if (!message) {
    throw new SealError('.', 'Message is missing.', 0, {});
  }
  if (typeof code === 'object') {
    metadata = code;
    code = 0;
  }
  if (typeof code !== 'number') {
    throw new SealError('.', 'Illegal data type, "code" should be number.', 0, {});
  }

  const caller = tracker()[0].getFileName();
  const basePath = caller.replace(/([/\\])(bin|lib|test)[/\\].*$/, '$1');
  const errorJsPath = `${basePath}lib${path.sep}errors.js`;
  const packageJsonPath = `${basePath}package.json`;
  let moduleName;

  if (basePath !== caller) {
    moduleName = require(packageJsonPath).name;

    if (!errorsMap[moduleName]) {
      errorsMap[moduleName] = require(errorJsPath);
    }
  }

  return new SealError(moduleName, message, code, metadata);
};

failure.joinMeta = function (sealError, metadata) {
  return Object.assign({}, sealError.metadata, metadata);
};

failure.httpExport = plain;

failure.jsonHttpExport = function (sealError) {
  return JSON.stringify(failure.httpExport(sealError));
};

failure.isFailure = function (error) {
  return (error !== undefined && error instanceof SealError);
};

module.exports = failure;
