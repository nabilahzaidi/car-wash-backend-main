import express from 'express';

import { userBookingController } from './userBooking.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get('/', auth(USER_ROLE.user), userBookingController.getUserBookings);

export const userBookingRoutes = router;
