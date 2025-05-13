/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: number
 *           example: 400
 *         errorCode:
 *           type: string
 *           example: "RESOURCE_NOT_FOUND"
 *         message:
 *           type: string
 *           example: "Recurso não encontrado com o ID fornecido"
 *         timestamp:
 *           type: string
 *           example: "2023-01-01T00:00:00Z"
 * 
 *     ValidationError:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: number
 *           example: 400
 *         errorCode:
 *           type: string
 *           example: "VALIDATION_ERROR"
 *         message:
 *           type: string
 *           example: "Erro de validação dos dados de entrada"
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: "type"
 *               message:
 *                 type: string
 *                 example: "Campo obrigatório ou formato inválido"
 *         timestamp:
 *           type: string
 *           example: "2023-01-01T00:00:00Z"
 */
