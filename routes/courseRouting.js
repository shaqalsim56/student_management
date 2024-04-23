import express from 'express';
import {
    //COURSES
    createCourse,
    getCourses,
    getCourse,
    updateCourse,
    deleteCourse,

} from '../controller/database_controller.js';

export const courseRouter = express.Router();

courseRouter.get('/all-courses', getCourses);

courseRouter.get('/course/:id', getCourse);

courseRouter.post('/new-course', createCourse);

courseRouter.patch('/update-course/:id', updateCourse);

courseRouter.delete('/delete-course/:id', deleteCourse);