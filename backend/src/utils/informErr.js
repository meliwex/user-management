class InformErr extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'InformErr';
    this.statusCode = statusCode
  }
}



module.exports = InformErr