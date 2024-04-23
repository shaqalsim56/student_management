import { pool } from "../data/database_connection.js";

// <--------------------DATABASE QUERIES FOR STUDENT TABLE-------------------->//

//Get All Students
export const getStudents = async(request, response, next)=>{
    let sqlQuery = `SELECT * FROM students`;

    const [students] = await pool.query(sqlQuery)

    response.status(200).json({
        status: 'success',
        results: students.length,
        data: {students}
    })
}

//Get Single Student
export const getStudent = async(request, response, next)=>{
    const id = request.params.id;
    let sqlQuery = `SELECT * FROM students WHERE id = ${id}`;

    const [students] = await pool.query(sqlQuery)
    if(students.length <=0){
        response.status(404).json({
            status: 'error',
            message: 'Student Record Not Found'
        });
    }else{
        response.status(200).json({
            status: 'success',
            results: students.length,
            data: { students: students[0] }
        });
    }

};

//Add New Student To Database
export const createStudent = async(request, response, next)=>{
    let sqlQuery = `INSERT INTO students (f_name, l_name, email, password) VALUES (?, ?, ?, ?)`;

    const [student] = await pool.query(sqlQuery, [
        request.body.f_n, 
        request.body.l_n,
        request.body.e_m, 
        request.body.p_w, 
        ])

    response.status(201).json({
        status: 'success',
        recordID: student.insertId,
    });
};

//Update Student
export const updateStudent = async(request, response, next)=>{
    let sqlQuery = `UPDATE students SET f_name = ?, l_name = ?, email=?, password=? WHERE id =?)`;

    const [student] = await pool.query(sqlQuery, [
        request.body.f_n, 
        request.body.l_n,
        request.body.e_m, 
        request.body.p_w, 
        request.body.id
        ])

        if(student.affectedRows <= 0){
            response.status(400).json({
                status: 'error',
                message: 'No Updates Were Made'
            });
        }else{
            response.status(200).json({
                status: 'success',
                affectedRows: student.affectedRows
            });
        }
};

//Delete Student From Database
export const deleteStudent = async(request, response, next)=>{
    const id = request.params.id;
    let sqlQuery = `DELETE FROM students WHERE id = ?`;

    const [student] = await pool.query(sqlQuery, [id])

    if(student.affectedRows <= 0){
        response.status(400).json({
            status: 'error',
            message: 'Unable To Delete'
        });
    }else{
        response.status(200).json({
            status: 'success',
            affectedRows: student.affectedRows
        });
    }
};


// <--------------------DATABASE QUERIES FOR COURSES TABLE-------------------->//

//Get All Courses
export const getCourses = async(request, response, next)=>{
    let sqlQuery = `SELECT * FROM courses`;

    const [courses] = await pool.query(sqlQuery)

    response.status(200).json({
        status: 'success',
        results: courses.length,
        data: {courses}
    })
}

//Get Single Course
export const getCourse = async(request, response, next)=>{
    const id = request.params.id;
    let sqlQuery = `SELECT * FROM courses WHERE id = ${id}`;

    const [courses] = await pool.query(sqlQuery)
    if(courses.length <=0){
        response.status(404).json({
            status: 'error',
            message: 'course Record Not Found'
        });
    }else{
        response.status(200).json({
            status: 'success',
            results: courses.length,
            data: { courses: courses[0] }
        });
    }

};

//Add New Course To Database
export const createCourse = async(request, response, next)=>{
    let sqlQuery = `INSERT INTO courses (name, teacher_id, level, price) VALUES (?, ?, ?, ?)`;

    const [course] = await pool.query(sqlQuery, [
        request.body.nm, 
        request.body.t_i,
        request.body.lvl, 
        request.body.prc, 
        ])

    response.status(201).json({
        status: 'success',
        recordID: course.insertId,
    });
};

//Update Course
export const updateCourse = async(request, response, next)=>{
    let sqlQuery = `UPDATE courses SET name = ?, teacher_id=?, level=?, price = ? WHERE id =?)`;

    const [course] = await pool.query(sqlQuery, [
        request.body.n, 
        request.body.t_i,
        request.body.lvl, 
        request.body.prc, 
        request.body.id
        ])

        if(course.affectedRows <= 0){
            response.status(400).json({
                status: 'error',
                message: 'No Updates Were Made'
            });
        }else{
            response.status(200).json({
                status: 'success',
                affectedRows: course.affectedRows
            });
        }
};

//Delete Course From Database
export const deleteCourse = async(request, response, next)=>{
    const id = request.params.id;
    let sqlQuery = `DELETE FROM courses WHERE id = ?`;

    const [student] = await pool.query(sqlQuery, [id])

    if(student.affectedRows <= 0){
        response.status(400).json({
            status: 'error',
            message: 'Unable To Delete'
        });
    }else{
        response.status(200).json({
            status: 'success',
            affectedRows: student.affectedRows
        });
    }
};

// <--------------------DATABASE QUERIES FOR TEACHERS TABLE-------------------->//

//Get All teachers
export const getTeachers = async(request, response, next)=>{
    let sqlQuery = `SELECT * FROM teachers`;

    const [teachers] = await pool.query(sqlQuery)

    response.status(200).json({
        status: 'success',
        results: teachers.length,
        data: {teachers}
    })
}

//Get Single teacher
export const getTeacher = async(request, response, next)=>{
    const id = request.params.id;
    let sqlQuery = `SELECT * FROM teachers WHERE id = ${id}`;

    const [teachers] = await pool.query(sqlQuery)
    if(teachers.length <=0){
        response.status(404).json({
            status: 'error',
            message: 'teacher Record Not Found'
        });
    }else{
        response.status(200).json({
            status: 'success',
            results: teachers.length,
            data: { teachers: teachers[0] }
        });
    }

};

//Add New teacher To Database
export const createTeacher = async(request, response, next)=>{
    let sqlQuery = `INSERT INTO teachers (name, teacher_id, level, price) VALUES (?, ?, ?, ?)`;

    const [teacher] = await pool.query(sqlQuery, [
        request.body.nm, 
        request.body.t_i,
        request.body.lvl, 
        request.body.prc, 
        ])

    response.status(201).json({
        status: 'success',
        recordID: teacher.insertId,
    });
};

//Update teacher
export const updateTeacher = async(request, response, next)=>{
    let sqlQuery = `UPDATE teachers SET name = ?, teacher_id=?, level=?, price = ? WHERE id =?)`;

    const [teacher] = await pool.query(sqlQuery, [
        request.body.n, 
        request.body.t_i,
        request.body.lvl, 
        request.body.prc, 
        request.body.id
        ])

        if(teacher.affectedRows <= 0){
            response.status(400).json({
                status: 'error',
                message: 'No Updates Were Made'
            });
        }else{
            response.status(200).json({
                status: 'success',
                affectedRows: teacher.affectedRows
            });
        }
};

//Delete Teacher From Database
export const deleteTeacher = async(request, response, next)=>{
    const id = request.params.id;
    let sqlQuery = `DELETE FROM teachers WHERE id = ?`;

    const [student] = await pool.query(sqlQuery, [id])

    if(student.affectedRows <= 0){
        response.status(400).json({
            status: 'error',
            message: 'Unable To Delete'
        });
    }else{
        response.status(200).json({
            status: 'success',
            affectedRows: student.affectedRows
        });
    }
};

// <--------------------DATABASE QUERIES FOR PAYMENTS TABLE-------------------->//

//Get All Payments
export const getPayments = async(request, response, next)=>{
    let sqlQuery = `SELECT * FROM payments`;

    const [payments] = await pool.query(sqlQuery)

    response.status(200).json({
        status: 'success',
        results: payments.length,
        data: {payments}
    })
}

//Get Single Payment
export const getPayment = async(request, response, next)=>{
    const id = request.params.id;
    let sqlQuery = `SELECT * FROM payments WHERE id = ${id}`;

    const [payments] = await pool.query(sqlQuery)
    if(payments.length <=0){
        response.status(404).json({
            status: 'error',
            message: 'payment Record Not Found'
        });
    }else{
        response.status(200).json({
            status: 'success',
            results: payments.length,
            data: { payments: payments[0] }
        });
    }

};

//Add New Payment To Database
export const createPayment = async(request, response, next)=>{
    let sqlQuery = `INSERT INTO payments (student_id, amount_paid, date) VALUES (?, ?, ?)`;

    const [payment] = await pool.query(sqlQuery, [
        request.body.nm, 
        request.body.t_i,
        request.body.lvl, 
        request.body.prc, 
        ])

    response.status(201).json({
        status: 'success',
        recordID: payment.insertId,
    });
};


