import { pool } from "../data/database_connection.js";

// <--------------------DATABASE QUERIES FOR STUDENT TABLE-------------------->//

//Get Single Student
// export const getStudent = async(request, response, next)=>{
//     const id = request.params.id;
//     let sqlQuery = `SELECT * FROM students INNER JOIN courses ON  course_one = courses.id OR course_two = courses.id OR course_three = courses.id
// 	INNER JOIN exam_level ON exam_level.id = courses.exam_level WHERE students.id = 1;`;

//     const [students] = await pool.query(sqlQuery)
//     if(students.length <=0){
//         response.status(404).json({
//             status: 'error',
//             message: 'Student Record Not Found'
//         });
//     }else{
//         response.status(200).json({
//             status: 'success',
//             results: students.length,
//             data: { students: students[0] }
//         });
//     }

<<<<<<< HEAD
    response.status(200).json({
        status: 'success',
        results: students.length,
        data: {students}
    });
=======
// };

// Calculates a student's balance and update their record
export async function getBalance(id) {
    const costQuery = `SELECT SUM(exams.price) AS totalCost FROM students INNER JOIN courses ON courses.id = course_one 
    OR courses.id = course_two OR courses.id = course_three INNER JOIN exams ON exams.id = exam 
    WHERE students.id = ${id}`;

    const paymentQuery = `SELECT SUM(amount) AS totalPayment FROM payments WHERE student_id = ${id}`;

    const [[cost]] = await pool.query(costQuery);
    const [[payments]] = await pool.query(paymentQuery);

    // Update the student's record with the calculated balance.
    const balance = cost.totalCost - payments.totalPayment;
    await pool.query(`UPDATE students SET balance = ${balance} WHERE id = ${id}`);

    return balance;
>>>>>>> updates
}

// Get the name of course
export async function getCourseName(course_id) {
    const sqlQuery = `SELECT course_name, abbreviation FROM courses INNER JOIN exams ON exams.id = exam
        WHERE courses.id = ${course_id}`;
    const [[course]] = await pool.query(sqlQuery);

    return course;
}

// Get all courses
export async function getCourses(request, response) {
    const sqlQuery = `SELECT courses.id, course_name, abbreviation, price FROM courses INNER JOIN exams on exams.id = exam
    ORDER BY id`
    const [courses] = await pool.query(sqlQuery);
    response.status(200).json({
        status: 'success',
        results: courses.length,
        data: { courses }
    });
}

// Get a single course
export async function getCourse(request, response) {
    const id = request.params.id;
    const sqlQuery = `SELECT courses.id, course_name, abbreviation, price FROM courses INNER JOIN exams on exams.id = exam
    WHERE courses.id = ${id}`;
    const [[course]] = await pool.query(sqlQuery);
    response.status(200).json({
        status: 'success',
        results: 1,
        course
    });
}

// Get all teachers
export async function getTeachers(request, response) {
    const sqlQuery = `SELECT * FROM teachers ORDER BY id ASC`;
    const [teachers] = await pool.query(sqlQuery);

    // Iterate over the returned records
    for (let teacher of teachers) {
        for (let key in teacher) {
            // Iterate over the teacher object and update the "courses" property 1-3 with the appropriate course name
            if (key.split('_').includes('course') && teacher[key]) {
                teacher[key] = `${(await getCourseName(teacher[key])).course_name} (${(await getCourseName(teacher[key])).abbreviation})`;
            }
        }
    }

    response.status(200).json({
        status: 'success',
        results: teachers.length,
        teachers: teachers
    });
}

// Get a single teachers
export async function getTeacher(request, response) {
    const id = request.params.id;
    const sqlQuery = `SELECT * FROM teachers WHERE id = ${id}`;
    const [[teacher]] = await pool.query(sqlQuery);

    // Iterate over the teacher object and update the "courses" property 1-3 with the appropriate course name
    for (let key in teacher) {
        if (key.split('_').includes('course') && teacher[key]) {
            teacher[key] = `${(await getCourseName(teacher[key])).course_name} (${(await getCourseName(teacher[key])).abbreviation})`;
        }
    }

    response.status(200).json({
        status: 'success',
        results: 1,
        teacher: teacher
    });
}

// Get a single student
export async function getStudent(request, response) {
    const id = request.params.id;
    await getBalance(id) // Calculate the student's balance.

    const sqlQuery = `SELECT * FROM students WHERE id = ${id}`;

    const [[student]] = await pool.query(sqlQuery); // This query returns an array of objects with "replicated" values
    // const student = _student[0]; 
    
    // Loop through the object and update the "courses" property 1-3 with the appropriate course name
    for (let key in student) {
        if (key.split('_').includes('course')) {
            student[key] = `${(await getCourseName(student[key])).course_name} (${(await getCourseName(student[key])).abbreviation})`;
        }
    }

    if (response) {
        response.status(200).json({
            status: 'success',
            results: 1,
            student: student
        });
    }
    else {
        return student;
    }
}

// Get all students
export async function getStudents(request, response) {
    const sqlQuery = `SELECT * FROM students ORDER BY id ASC`;
    const [students] = await pool.query(sqlQuery);

    // Iterate over the returned records
    for (let student of students) {
        student.balance = await getBalance(student.id); // Calculate the student's balance

        // Iterate over the student object and update the "courses" property 1-3 with the appropriate course name
        for (let key in student) {
            if (key.split('_').includes('course')) {
                student[key] = `${(await getCourseName(student[key])).course_name} (${(await getCourseName(student[key])).abbreviation})`;
            }
        } 
    }
    
    response.status(200).json({
        status: 'success',
        results: students.length,
        students: students 
    });
}

export async function getPayments(request, response) {
    const sqlQuery = `SELECT payments.id AS payment_id, payment_date, amount, student_id, first_nm, 
    last_nm FROM payments INNER JOIN students ON students.id = student_id`;

    const [payments] = await pool.query(sqlQuery);

    response.status(200).json({
        status: 'success',
        results: 1,
        payments
    });
}

export async function getPaymentHistory(request, response) {
    const id = request.params.id;

    const sqlQuery = `SELECT payments.id AS payment_id, payment_date, amount, student_id, first_nm, 
    last_nm FROM payments INNER JOIN students ON students.id = student_id
    WHERE students.id = ${id}`;

    const [payment] = await pool.query(sqlQuery);

    response.status(200).json({
        status: 'success',
        results: 1,
        payment
    });
}

// Add a payment to the payments table
export async function addPayment(request, response) {
    const {student_id, amount} = request.body;
    // This function is used to convert todays date to the format acceptable by MYSQL.
    const formatDate =  datetime => {
        const day = Intl.NumberFormat('en-US', {minimumIntegerDigits: 2}).format(datetime.getDate());
        const month = Intl.NumberFormat('en-US', {minimumIntegerDigits: 2}).format(datetime.getMonth() + 1);
        const year = datetime.getFullYear();
    
        return `${year}-${month}-${day}`;
    }

    const sqlQuery = `INSERT INTO payments (student_id, payment_date, amount) VALUES
    (${student_id}, '${formatDate(new Date())}', ${amount})`;

    const [result] = await pool.query(sqlQuery);
    await getBalance(student_id); //Update the students balance.

    response.status(200).json({
        status: 'success',
        result
    });
}

// Add a student
export async function addStudent(request, response) {
    const {first_nm, last_nm, email, course_one, course_two, course_three} = request.body;
    const student = {
        first_nm,
        last_nm,
        email,
        course_one,
        course_two,
        course_three
    }
    const sqlQuery = ` INSERT INTO students (first_nm, last_nm, email, course_one, course_two, course_three) 
        VALUES ('${student.first_nm}', '${student.last_nm}', '${student.email}', '${student.course_one}', 
        ${student.course_two}, ${student.course_three})`;
    
    const [results] = await pool.query(sqlQuery);
    response.status(200).json({
        status: 'success',
        results: results
    });
}

// Add a teacher 
export async function addTeacher(request, response) {
    const {first_nm, last_nm, email, course_one, course_two} = request.body;
    const teacher = {
        first_nm,
        last_nm,
        email,
        course_one,
        course_two
    }

    const sqlQuery = (teacher.course_two) ? `INSERT INTO teachers (first_nm, last_nm, email, course_one, course_two) VALUES 
    ('${teacher.first_nm}', '${teacher.last_nm}', '${teacher.email}', '${teacher.course_one}', '${teacher.course_two}')` 
        : 
    `INSERT INTO teachers (first_nm, last_nm, email, course_one) VALUES 
    ('${teacher.first_nm}', '${teacher.last_nm}', '${teacher.email}', '${teacher.course_one}')`;

    const [result] = await pool.query(sqlQuery);

    response.status(200).json({
        status: 'success',
        results: result
    });
}

// Add a course
export async function addCourse(request, response) {
    const {course_name, exam} = request.body;

    const [result] = await pool.query('INSERT INTO courses (course_name, exam) VALUES (?, ?)',
     [course_name, exam]);
    response.status(200).json({
        status: 'success',
        results: result
    });
}

// Edit teacher
export async function editTeacher(request, response) {
    const {first_nm, last_nm, email, course_one, course_two, course_three} = request.body;
    const teacher = {
        id: request.params.id,
        first_nm,
        last_nm,
        email,
        course_one,
        course_two,
        course_three
    }

    let result;
    if (teacher.course_two) {
        [result] = await pool.query (`UPDATE teachers SET first_nm = ?, last_nm = ?, email = ?, course_one = ?, course_two = ? 
        WHERE id = ?`, [teacher.first_nm, teacher.last_nm, teacher.email, teacher.course_one, teacher.course_two, teacher.id]);
    }
    else {
        [result] = await pool.query (`UPDATE teachers SET first_nm = ?, last_nm = ?, email = ?, course_one = ?, course_two = ?
         WHERE id = ?`, [teacher.first_nm, teacher.last_nm, teacher.email, teacher.course_one, null, teacher.id]);
    }
    
    response.status(200).json({
        status: 'success',
        results: result
    });;
}
