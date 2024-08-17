export class ResponseObject {
  constructor(status, message, data, statusCode) {
    this.status = status
    this.message = message || null
    this.data = data || null
    this.statusCode = statusCode || null
  }

  static success(data, statusCode) {
    return new ResponseObject('success', null, data, statusCode)
  }

  static error(message, statusCode) {
    return new ResponseObject('error', message, null, statusCode)
  }
}
