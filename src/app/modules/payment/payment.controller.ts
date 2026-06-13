
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { paymentServices } from "./payment.service";


const initiateQuickPaymentController = catchAsync(async (req, res) => {
  const paymentData = req.body;
  const result = await paymentServices.initiateQuickPayment(paymentData);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment initiated successfully',
    data: result
  });
});

const confirmationController= catchAsync(async (req, res) => {
  
   
   const {transactionId}= req.query;
    const result = await paymentServices.confirmationService(transactionId as string );
 
   res.send(result)
  });

export const paymentController = {
    initiateQuickPaymentController,
    confirmationController
}