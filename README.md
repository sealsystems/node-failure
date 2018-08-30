# @sealsystems/failure

[![CircleCI](https://circleci.com/gh/sealsystems/node-failure.svg?style=svg)](https://circleci.com/gh/sealsystems/node-failure)
[![AppVeyor](https://ci.appveyor.com/api/projects/status/abvu4p3jf87kusxb?svg=true)](https://ci.appveyor.com/project/Plossys/node-failure)

Easy handling of error codes and metadata.

---

## Attention

Beginning with version 2.0.0 the argument order of `failure` function changed! See description below.

---

## Installation

```bash
npm install @sealsystems/failure
```

## Quick start

First you need to add a reference to @sealsystems/failure within your application.

```javascript
const failure = require('@sealsystems/failure');
```

Then you can create an error object.

```javascript
const err = failure('Universal error.', 42, { username: 'hugo' });
```

This creates an new object of type `Error` with some additional properties:

```javascript
{
  name: 'SealError',
  code: 42,
  message: 'Universal error',
  metadata: {
    username: 'hugo'
  }
  ...
}
```

## API

### Creating an error object

The `failure` function creates a new object of type `Error`. It expects the file `errors.js` to exist in callers module `lib` subdirectory if the calling script resides in `bin`, `lib` or `test` subdirectories. The map defined by `errors.js` is used to set the `metadata.kbcode` entry automatically.

```javascript
const error = failure(message, code, metadata);
```

Parameter:
```
message    string   mandatory   error message
code       number   optional    error code
metadata   object   optional    error metadata
```

Result: new error object

### Chaining error history

For creating a history of errors while throwing upward in callstack every error object has the `chain` method.

```javascript
myError.chain(previousError);
```

Parameter:
```
previousError   object   mandatory    error object returned by a previously called function
```

Result: the callers error object, to make calls to `chain` chainable. Each `chain` stores the data of the given error object into `metadata.cause`.

### Join metadata

Join metadata and error object metadata into a new metadata object for extended logging.

**Attention**: This function does not alter the errors metadata, it just returns a new metadata object.

```javascript
const joinedMeta = failure.joinMeta(error, metadata);
```

Parameter:
```
error      object   mandatory   previously created error object
metadata   object   mandatory   additional metadata to join
```

Result: new metadata object

### Export plain object

Export a plain new object for return in REST-API.

```javascript
const plainNewObject = failure.httpExport(error);
```

Parameter:
```
error      object   mandatory   previously created error object
```

Result: new plain javascript object of this structure:

```javascript
{
  code: error.code,
  message: error.message,
  metadata: error.metadata
}
```

### Export JSON string

Export plain error object as JSON string for return in REST-API without bodyparser.

```javascript
const stringifiedObject = failure.jsonHttpExport(error);
```

Parameter:
```
error      object   mandatory   previously created error object
```

Result: JSON string of plain object created by `httpExport`

### Test for failure

For testing if an error is a failure you can call `isFailure` function.

```javascript
if (failure.isFailure(error)) { ... }
```

Parameter:
```
error      object   mandatory   the error object to test
```
