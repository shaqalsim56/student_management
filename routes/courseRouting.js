import express from 'express';
import {
    //COURSES
    addCourse,
    getCourses,
    getCourse,

} from '../controller/database_controller.js';

export const courseRouter = express.Router();

courseRouter.get('/all-courses', getCourses);

courseRouter.get('/course/:id', getCourse);

courseRouter.post('/new-course', addCourse);

// courseRouter.patch('/update-course/:id', updateCourse);

// courseRouter.delete('/delete-course/:id', deleteCourse);