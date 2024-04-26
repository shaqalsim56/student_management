import express from 'express';
import {
    //PAYMENTS
    addPayment,
    getPayments,
    getPayment

} from '../controller/database_controller.js';

export const paymentRouter = express.Router();

paymentRouter.get('/all-payments', getPayments);

paymentRouter.get('/payment/:id', getPayment);

paymentRouter.post('/new-payment', addPayment);

