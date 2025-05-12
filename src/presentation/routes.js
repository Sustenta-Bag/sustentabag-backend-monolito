import express from 'express';
import { setupModuleRouters } from '../application/bootstrap.js';
import { sequelize } from '../infrastructure/database/sequelize.js';

const router = express.Router();

const { 
    bagRouter, 
    clientRouter, 
    addresRouter, 
    businessRouter,
    authRouter,
    locationRouter
} = setupModuleRouters({
    sequelizeInstance: sequelize
});

router.use('/api/addresses', addresRouter);
router.use('/api/clients', clientRouter);
router.use('/api/businesses', businessRouter);
router.use('/api/bags', bagRouter);
router.use('/api/auth', authRouter);
router.use('/api/location', locationRouter);

export default router;