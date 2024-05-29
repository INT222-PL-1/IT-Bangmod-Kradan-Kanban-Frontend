export class ResponseObject {
  constructor(status, message, data) {
    this.status = status
    this.message = message || null
    this.data = data
  }

  static success(data) {
    return new ResponseObject('success', null, data)
  }

  static error(message) {
    return new ResponseObject('error', message, null)
  }
}
