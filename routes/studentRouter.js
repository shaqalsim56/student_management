import express from 'express';
import { Email } from '../utility/email.js';
import {
    //STUDENTS
    addStudent,
    getStudents,
    getStudent,
} from '../controller/database_controller.js';

export const studentRouter = express.Router();

studentRouter.get('/all-students', getStudents);

studentRouter.get('/student/:id', getStudent); 

studentRouter.post('/new-student', addStudent);

studentRouter.get('/send-email/:id', async (request, response) => {
    const student = await getStudent(request);
    const email = new Email(student);
    await email.sendMail('balanceReminder', 'BALANCE REMINDER', student);
    
    response.status(200).json({
        status: 'Success',
        ...student
    })
});
// studentRouter.patch('/update-student/:id', updateStudent);

// studentRouter.delete('/delete-student/:id', deleteStudent);