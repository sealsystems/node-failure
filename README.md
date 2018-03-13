# @sealsystems/failure

[![CircleCI](https://circleci.com/gh/sealsystems/node-failure.svg?style=svg)](https://circleci.com/gh/sealsystems/node-failure)
[![AppVeyor](https://ci.appveyor.com/api/projects/status/abvu4p3jf87kusxb?svg=true)](https://ci.appveyor.com/project/Plossys/node-failure)

Easy handling of error codes and metadata.

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
const err = failure(42, 'Universal error.', { username: 'hugo' });
```

This creates an object of type `Error` with some additional properties:

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

### Creating an error objects

Create a new object of type `Error`.

```javascript
const error = failure(code, message, metadata);
```

Parameter:
```
code       number   optional    error code
message    string   mandatory   error message
metadata   object   optional    error metadata
```

Result: new error object

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
