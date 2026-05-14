import {Router} from 'express';
import * as AnalyticsController from "../controllers/analyticsController.js";
import { authenticateToken } from '../middleware/authenticate.js';

const router = Router();

router.get('/core-groups', authenticateToken, AnalyticsController.getCoreGroupsDistribution);

router.get('/gender', authenticateToken, AnalyticsController.getGenderDistribution);

router.get('/employment-types', authenticateToken, AnalyticsController.getEmploymentTypesDistribution);

router.get('/room-utilization', authenticateToken, AnalyticsController.fetchRoomUtilization);

export default router;