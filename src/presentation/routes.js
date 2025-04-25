import express from 'express';

const router = express.Router();

import { setupModuleRouters } from '../application/bootstrap.js';

const { 
    bagRouter, 
    clientRouter, 
    addresRouter, 
    businessRouter 
} = setupModuleRouters();

router.use('/api/addresses', addresRouter);
router.use('/api/clients', clientRouter);
router.use('/api/businesses', businessRouter);
router.use('/api/bags', bagRouter);

export default router;