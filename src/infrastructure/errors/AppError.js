/**
 * Classe para representar erros da aplicação de forma padronizada
 */
class AppError extends Error {
  /**
   * Cria uma nova instância de erro da aplicação
   * 
   * @param {string} message - Mensagem descritiva do erro
   * @param {string} errorCode - Código específico do erro (ex: BAG_NOT_FOUND)
   * @param {number} statusCode - Código de status HTTP (ex: 400, 404, 500)
   * @param {Object|null} details - Detalhes adicionais do erro (opcional)
   */
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

  /**
   * Converte o erro para um formato adequado para resposta HTTP
   * 
   * @returns {Object} Objeto formatado para resposta de erro
   */
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

  /**
   * Cria um erro específico para entidade não encontrada
   * 
   * @param {string} entityName - Nome da entidade (ex: "Sacola")
   * @param {string|number} id - Identificador da entidade
   * @returns {AppError} Instância de erro formatada
   */
  static notFound(entityName, id) {
    const message = `${entityName} não encontrada com o ID: ${id}`;
    return new AppError(message, `${entityName.toUpperCase()}_NOT_FOUND`, 404);
  }

  /**
   * Cria um erro para validação de dados
   * 
   * @param {Array} validationErrors - Array com erros de validação
   * @returns {AppError} Instância de erro formatada
   */
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

  /**
   * Cria um erro para erros de servidor internos
   * 
   * @param {string} message - Detalhes do erro interno
   * @param {Error} originalError - Erro original capturado
   * @returns {AppError} Instância de erro formatada
   */
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