import express from 'express';
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

// studentRouter.patch('/update-student/:id', updateStudent);

// studentRouter.delete('/delete-student/:id', deleteStudent);