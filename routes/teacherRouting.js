import express from 'express';
import {
    //TEACHERS
    createTeacher,
    getTeachers,
    getTeacher,
    updateTeacher,
    deleteTeacher,
} from '../controller/database_controller.js';

export const teacherRouter = express.Router();

teacherRouter.get('/all-teachers', getTeachers);

teacherRouter.get('/teacher/:id', getTeacher);

teacherRouter.post('/new-teacher', createTeacher);

teacherRouter.patch('/update-teacher/:id', updateTeacher);

teacherRouter.delete('/delete-teacher/:id', deleteTeacher);