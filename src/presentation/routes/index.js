import express from 'express';
import BagController from '../controllers/BagController.js';
import BagService from '../../application/services/BagService.js';
import PostgresBagRepository from '../../infrastructure/repositories/PostgresBagRepository.js';
import { 
  validateCreateBag, 
  validateUpdateBag, 
  validateBagId, 
  validateCompanyId,
  validateStatusUpdate
} from '../middleware/bagValidation.js';

/**
 * @swagger
 * tags:
 *   name: Sacolas
 *   description: Gerenciamento de sacolas ecológicas
 */

/**
 * Configura as rotas para o módulo de Bags
 * @param {Object} router - Router do Express para adicionar as rotas
 * @param {Object} options - Opções de configuração
 * @param {Object} options.bagRepository - Repositório de sacolas (opcional)
 */
export const setupRoutes = (router, options = {}) => {
  const bagRepository = options.bagRepository || new PostgresBagRepository();
  const bagService = new BagService(bagRepository);
  const bagController = new BagController(bagService);

  const routePrefix = '/bags';
  
  /**
   * @swagger
   * /api/bags:
   *   post:
   *     summary: Criar uma nova sacola
   *     tags: [Sacolas]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - type
   *               - price
   *               - companyId
   *             properties:
   *               type:
   *                 type: string
   *                 enum: [Doce, Salgada, Mista]
   *               price:
   *                 type: number
   *                 format: float
   *               description:
   *                 type: string
   *               companyId:
   *                 type: integer
   *               status:
   *                 type: integer
   *                 enum: [0, 1]
   *                 default: 1
   *     responses:
   *       201:
   *         description: Sacola criada com sucesso
   *       400:
   *         description: Dados inválidos
   */
  router.post(`${routePrefix}`, validateCreateBag, bagController.createBag.bind(bagController));
  
  /**
   * @swagger
   * /api/bags:
   *   get:
   *     summary: Listar todas as sacolas
   *     tags: [Sacolas]
   *     responses:
   *       200:
   *         description: Lista de sacolas
   *       500:
   *         description: Erro do servidor
   */
  router.get(`${routePrefix}`, bagController.getAllBags.bind(bagController));
  
  /**
   * @swagger
   * /api/bags/{id}:
   *   get:
   *     summary: Obter detalhes de uma sacola
   *     tags: [Sacolas]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID da sacola
   *     responses:
   *       200:
   *         description: Detalhes da sacola
   *       404:
   *         description: Sacola não encontrada
   */
  router.get(`${routePrefix}/:id`, validateBagId, bagController.getBag.bind(bagController));
  
  /**
   * @swagger
   * /api/bags/{id}:
   *   put:
   *     summary: Atualizar informações de uma sacola
   *     tags: [Sacolas]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID da sacola
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               type:
   *                 type: string
   *                 enum: [Doce, Salgada, Mista]
   *               price:
   *                 type: number
   *                 format: float
   *               description:
   *                 type: string
   *               companyId:
   *                 type: integer
   *               status:
   *                 type: integer
   *                 enum: [0, 1]
   *     responses:
   *       200:
   *         description: Sacola atualizada com sucesso
   *       404:
   *         description: Sacola não encontrada
   *       400:
   *         description: Dados inválidos
   */
  router.put(`${routePrefix}/:id`, validateUpdateBag, bagController.updateBag.bind(bagController));
  
  /**
   * @swagger
   * /api/bags/{id}:
   *   delete:
   *     summary: Remover uma sacola
   *     tags: [Sacolas]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID da sacola
   *     responses:
   *       204:
   *         description: Sacola removida com sucesso
   *       404:
   *         description: Sacola não encontrada
   */
  router.delete(`${routePrefix}/:id`, validateBagId, bagController.deleteBag.bind(bagController));

  /**
   * @swagger
   * /api/company/{companyId}/bags:
   *   get:
   *     summary: Listar todas as sacolas de uma empresa
   *     tags: [Sacolas]
   *     parameters:
   *       - in: path
   *         name: companyId
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID da empresa
   *     responses:
   *       200:
   *         description: Lista de sacolas da empresa
   *       500:
   *         description: Erro do servidor
   */
  router.get(`/company/:companyId${routePrefix}`, validateCompanyId, bagController.getBagsByCompany.bind(bagController));

  /**
   * @swagger
   * /api/company/{companyId}/bags/active:
   *   get:
   *     summary: Listar sacolas ativas de uma empresa
   *     tags: [Sacolas]
   *     parameters:
   *       - in: path
   *         name: companyId
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID da empresa
   *     responses:
   *       200:
   *         description: Lista de sacolas ativas da empresa
   *       500:
   *         description: Erro do servidor
   */
  router.get(`/company/:companyId${routePrefix}/active`, validateCompanyId, bagController.getActiveBagsByCompany.bind(bagController));

  /**
   * @swagger
   * /api/bags/{id}/status:
   *   patch:
   *     summary: Alterar o status de uma sacola
   *     tags: [Sacolas]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID da sacola
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - status
   *             properties:
   *               status:
   *                 type: integer
   *                 enum: [0, 1]
   *                 description: 0 para inativo, 1 para ativo
   *     responses:
   *       200:
   *         description: Status da sacola alterado com sucesso
   *       404:
   *         description: Sacola não encontrada
   *       400:
   *         description: Dados inválidos
   */
  router.patch(`${routePrefix}/:id/status`, validateStatusUpdate, bagController.changeBagStatus.bind(bagController));
};