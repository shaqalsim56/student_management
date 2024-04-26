import express from 'express';
import {
    //TEACHERS
    addTeacher,
    getTeachers,
    getTeacher,
    editTeacher,
} from '../controller/database_controller.js';

export const teacherRouter = express.Router();
 
teacherRouter.get('/all-teachers', getTeachers);

teacherRouter.get('/teacher/:id', getTeacher); 

teacherRouter.post('/new-teacher', addTeacher);

teacherRouter.patch('/update-teacher/:id', editTeacher);

// teacherRouter.delete('/delete-teacher/:id', deleteTeacher);