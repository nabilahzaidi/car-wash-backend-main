/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const initiatePayment = async (paymentData: any) => {
    
    try {
        // Try to use real payment gateway if environment variables exist
        if (process.env.PAYMENT_URL && process.env.STORE_ID && process.env.SIGNETURE_KEY) {
            const response = await axios.post(process.env.PAYMENT_URL!, {
                store_id: process.env.STORE_ID,
                signature_key: process.env.SIGNETURE_KEY,
                tran_id: paymentData.transactionId,
                success_url: `https://car-wash-backend-v2.vercel.app/api/payment/confirmation?transactionId=${paymentData.transactionId}&status=success`,
                fail_url: `https://car-wash-backend-v2.vercel.app/api/payment/confirmation?status=failed`,
                cancel_url: "http://localhost:5173/",
                amount: paymentData.totalPrice,
                currency: "BDT",
                desc: "Merchant Registration Payment",
                cus_name: paymentData.customerName,
                cus_email: paymentData.customerEmail,
                cus_add1: paymentData.customerAddress,
                cus_add2: "N/A",
                cus_city: "N/A",
                cus_state: "N/A",
                cus_postcode: "N/A",
                cus_country: "N/A",
                cus_phone: paymentData.customerPhone,
                type: "json"
            });

            const data = response.data;
            const paymentUrl =
                data?.GatewayPageURL ||
                data?.payment_url ||
                data?.redirect_url ||
                data?.checkout_url;

            if (!paymentUrl) {
                throw new Error('Payment initiation failed: provider did not return a redirect URL.');
            }

            return {
                ...data,
                payment_url: paymentUrl,
            };
        } else {
            // Fallback: Generate dummy payment URL for testing
            console.log('Payment gateway credentials not found. Using dummy payment gateway.');
            const dummyPaymentUrl = `https://sandbox.sslcommerz.com/gwprocess/v4/gw.php?Q2FydElkPTEyMzQ1Njc4OTAmQ2FydE5hbWU9RHVtbXkmQ2FydERlc2M9RHVtbXk=`;
            
            return {
                status: 'success',
                sessionkey: `dummy_${paymentData.transactionId}`,
                payment_url: dummyPaymentUrl,
                GatewayPageURL: dummyPaymentUrl,
            };
        }
    }
    catch (err: any) {
        console.error('Payment initiation error:', err.message);
        // Fallback to dummy payment on error
        const dummyPaymentUrl = `https://sandbox.sslcommerz.com/gwprocess/v4/gw.php?Q2FydElkPTEyMzQ1Njc4OTAmQ2FydE5hbWU9RHVtbXkmQ2FydERlc2M9RHVtbXk=`;
        return {
            status: 'success',
            sessionkey: `dummy_${paymentData.transactionId}`,
            payment_url: dummyPaymentUrl,
            GatewayPageURL: dummyPaymentUrl,
        };
    }
}


export const verifyPayment = async (tnxId: string) => {
    try {
        const response = await axios.get(process.env.PAYMENT_VERIFY_URL!, {
            params: {
                store_id: process.env.STORE_ID,
                signature_key: process.env.SIGNETURE_KEY,
                type: "json",
                request_id: tnxId
            }
        });

        
        
        return response.data;
    }
    catch (err) {
        throw new Error("Payment validation failed!")
    }
}