class AppError extends Error {
  constructor(message, errorCode, statusCode = 400, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    const errorResponse = {
      statusCode: this.statusCode,
      errorCode: this.errorCode,
      message: this.message,
      timestamp: this.timestamp
    };

    if (this.details) {
      errorResponse.details = this.details;
    }

    return errorResponse;
  }

  static notFound(entityName, id) {
    const message = `${entityName} não encontrada com o ID: ${id}`;
    return new AppError(message, `${entityName.toUpperCase()}_NOT_FOUND`, 404);
  }

  static validationError(validationErrors) {
    const formattedErrors = validationErrors.map(error => ({
      field: error.param,
      message: error.msg
    }));

    const error = new AppError(
      'Erro de validação dos dados de entrada',
      'VALIDATION_ERROR',
      400
    );
    error.errors = formattedErrors;
    
    return error;
  }

  static internal(message, originalError = null) {
    const error = new AppError(
      message || 'Erro interno do servidor',
      'INTERNAL_SERVER_ERROR',
      500
    );
    
    if (originalError && process.env.NODE_ENV !== 'production') {
      error.details = {
        originalMessage: originalError.message,
        stack: originalError.stack
      };
    }
    
    return error;
  }
}

export default AppError;