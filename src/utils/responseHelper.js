const sendSuccessResponse = (res, statusCode = 200, data = null, message = null) => {
  const response = {
    success: true
  };

  if (message) response.message = message;
  if (data) response.data = data;

  return res.status(statusCode).json(response);
};

const sendErrorResponse = (res, statusCode = 500, message = 'Server Error', errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors) response.errors = errors;

  return res.status(statusCode).json(response);
};

module.exports = {
  sendSuccessResponse,
  sendErrorResponse
};