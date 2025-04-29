import { Router } from 'express';


const router = Router();
router.route('/').get((req, res) => {
    res.status(200).json({ message: 'Health check done successfully' });
});

export default router;