const express = require('express');
const BagController = require('../controllers/BagController');
const BagService = require('../../services/BagService');
const PostgresBagRepository = require('../../../infrastructure/repositories/PostgresBagRepository');
const { 
  validateCreateBag, 
  validateUpdateBag, 
  validateBagId, 
  validateCompanyId,
  validateStatusUpdate
} = require('../middleware/bagValidation');

/**
 * @swagger
 * tags:
 *   name: Sacolas
 *   description: Gerenciamento de sacolas ecológicas
 */

const setupRoutes = (app) => {
  const router = express.Router();
  
  // Dependency injection
  const bagRepository = new PostgresBagRepository();
  const bagService = new BagService(bagRepository);
  const bagController = new BagController(bagService);

  /**
   * @swagger
   * /bags:
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
  router.post('/bags', validateCreateBag, bagController.createBag.bind(bagController));
  
  /**
   * @swagger
   * /bags:
   *   get:
   *     summary: Listar todas as sacolas
   *     tags: [Sacolas]
   *     responses:
   *       200:
   *         description: Lista de sacolas
   *       500:
   *         description: Erro do servidor
   */
  router.get('/bags', bagController.getAllBags.bind(bagController));
  
  /**
   * @swagger
   * /bags/{id}:
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
  router.get('/bags/:id', validateBagId, bagController.getBag.bind(bagController));
  
  /**
   * @swagger
   * /bags/{id}:
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
  router.put('/bags/:id', validateUpdateBag, bagController.updateBag.bind(bagController));
  
  /**
   * @swagger
   * /bags/{id}:
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
  router.delete('/bags/:id', validateBagId, bagController.deleteBag.bind(bagController));

  /**
   * @swagger
   * /company/{companyId}/bags:
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
  router.get('/company/:companyId/bags', validateCompanyId, bagController.getBagsByCompany.bind(bagController));

  /**
   * @swagger
   * /company/{companyId}/bags/active:
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
  router.get('/company/:companyId/bags/active', validateCompanyId, bagController.getActiveBagsByCompany.bind(bagController));

  /**
   * @swagger
   * /bags/{id}/status:
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
  router.patch('/bags/:id/status', validateStatusUpdate, bagController.changeBagStatus.bind(bagController));

  // Apply routes to app with prefix
  app.use('/api', router);
};

module.exports = { setupRoutes };