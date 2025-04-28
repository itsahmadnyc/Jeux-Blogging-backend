
const response = require('./responseHandler');

/**
 * Send a 200 OK success response.
 * 
 * @param {object} res - Express response object
 * @param {string} [message='Request successful'] - Success message
 * @param {object} [data={}] - Data payload to send
 * @returns {object} Express response object
 */

const ok = (res, message = 'Request successful', data = {}) => {
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  };
  
  const created = (res, message = 'Resource created successfully', data = {}) => {
    return res.status(201).json({
      success: true,
      statusCode: 201,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  };
  
  const updated = (res, message = 'Resource updated successfully', data = {}) => {
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  };
  
  const deleted = (res, message = 'Resource deleted successfully', data = {}) => {
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  };
  
  // === Error Responses ===
  
  const badRequest = (res, message = 'Bad request', details = {}) => {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message,
      details,
      timestamp: new Date().toISOString(),
    });
  };
  
  const unauthorized = (res, message = 'Unauthorized access', details = {}) => {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message,
      details,
      timestamp: new Date().toISOString(),
    });
  };
  
  const forbidden = (res, message = 'Forbidden', details = {}) => {
    return res.status(403).json({
      success: false,
      statusCode: 403,
      message,
      details,
      timestamp: new Date().toISOString(),
    });
  };
  
  const notFound = (res, message = 'Resource not found', details = {}) => {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message,
      details,
      timestamp: new Date().toISOString(),
    });
  };
  
  const internalServerError = (res, message = 'Internal server error', details = {}) => {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message,
      details,
      timestamp: new Date().toISOString(),
    });
  };
  
  const notImplemented = (res, message = 'Not implemented', details = {}) => {
    return res.status(501).json({
      success: false,
      statusCode: 501,
      message,
      details,
      timestamp: new Date().toISOString(),
    });
  };
  
  // === General Response Handlers ===
  
  const successResponse = (res, statusCode = 200, message = 'Success', data = {}) => {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  };
  
  const errorResponse = (res, statusCode = 500, message = 'An error occurred', details = {}) => {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      details,
      
      timestamp: new Date().toISOString(),
    });




 //Example Usage

// Success Response handler for usage in controller 
response.ok(res, 'Fetched data successfully', { users });
response.created(res, 'User created', newUser);
response.updated(res, 'Profile updated', updatedData);
response.deleted(res, 'Account deleted');

// Error Response handler for usage in controller
response.badRequest(res, 'Invalid email format');
response.unauthorized(res, 'Token expired');
response.internalServerError(res, 'Database crashed', { error: err.message });
  };


  
  module.exports = {
    
    
    successResponse,
    errorResponse,
  
    ok,
    created,
    updated,
    deleted,
  
    badRequest,
    unauthorized,
    forbidden,
    notFound,
    internalServerError,
    notImplemented,
  };
  
  



