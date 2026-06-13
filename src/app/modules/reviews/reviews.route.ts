
import express from 'express';

import { ReviewsController } from './reviews.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

// In development, allow POST /reviews without auth to avoid blocking review
// submission when the refresh-token flow is not available.
const requireAuth =
  process.env.NODE_ENV === 'production'
    ? auth(USER_ROLE.user)
    : (_req: express.Request, _res: express.Response, next: express.NextFunction) => next();

const router = express.Router();

router.post('/', requireAuth, ReviewsController.createReview)
router.get('/', ReviewsController.getAllReviews)



export const ReviewsRoutes = router;