/* interface Ierror {
  errorCode: number,
  httpCode: number,
  message: string
} */

interface IerrorCodes {
  // [error: string] : Ierror
  [errorName: string] : {
    errorCode: number,
    httpCode: number,
    message: string
  }
}

// List of every error for proper responses
export const errorCodes : IerrorCodes = {
  INTERNAL_SERVER_ERROR: { errorCode: 1000, httpCode: 500, message: 'Internal server error, please try again later or contact the support' },
  NOT_FOUND: { errorCode: 1001, httpCode: 404, message: 'Resource not found' },
  WRONG_PARAMETERS: { errorCode: 1002, httpCode: 400, message: 'Wrong parameters, please check the request' },

};
