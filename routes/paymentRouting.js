import express from 'express';
import {
    //PAYMENTS
    addPayment,
    getPayments,
    getPaymentHistory

} from '../controller/database_controller.js';

export const paymentRouter = express.Router();

paymentRouter.get('/all-payments', getPayments);

paymentRouter.get('/payment/:id', getPaymentHistory);

paymentRouter.post('/new-payment', addPayment);

