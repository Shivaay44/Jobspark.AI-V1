import { Router } from 'express';
import { chatWithAI, analyzeResume } from '../controllers/aiController';
import { improveSection } from '../controllers/improveController';

const router = Router();

router.post('/chat', chatWithAI);
router.post('/analyze', analyzeResume);
router.post('/improve', improveSection);

export default router;
