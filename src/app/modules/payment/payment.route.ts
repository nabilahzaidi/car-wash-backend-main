import { Router } from "express";
import { paymentController } from "./payment.controller";

const router = Router()

router.post('/initiate', paymentController.initiateQuickPaymentController)
router.post('/confirmation',paymentController.confirmationController)


export const paymentRoutes = router;