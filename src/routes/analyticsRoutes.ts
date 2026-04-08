import {Router} from 'express';
import * as AnalyticsController from "../controllers/analyticsController.ts";
import { authenticateToken } from '../middleware/authenticate.ts';

const router = Router();

router.get('/core-groups', authenticateToken, AnalyticsController.getCoreGroupsDistribution);

router.get('/gender', authenticateToken, AnalyticsController.getGenderDistribution);

router.get('/employment-types', authenticateToken, AnalyticsController.getEmploymentTypesDistribution);

export default router;