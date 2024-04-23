import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import { studentRouter } from './routes/studentRouter.js'
import { teacherRouter } from './routes/teacherRouting.js'
import { paymentRouter } from './routes/paymentRouting.js'
import { courseRouter } from './routes/courseRouting.js'

const app = express();

app.options('*', cors(['http://localhost:LOCALHOSTOFANGULARSERVER']));
app.use(cors(['http://localhost:LOCALHOSTOFANGULARSERVER']));

//Body Parsing
app.use(express.json({limit: '5kb'}));
app.use(express.urlencoded({ extended: true, limit: '5kb' }));

if(process.env.NODE_ENV != 'production') app.use(morgan('dev'));

//Setup API Endpoint

//Student
app.use('/api/v1/students', studentRouter);

//Course
app.use('/api/v1/courses', courseRouter);

//Payment
app.use('/api/v1/payments', paymentRouter);

//Teacher
app.use('/api/v1/teachers', teacherRouter);

const port = process.env.PORT;

//Initialize Server 
app.listen(port, () => {
    console.log(`The Server is Running On Port ${port}`);
});