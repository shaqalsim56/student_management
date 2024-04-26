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
}

// Get the name of course
export async function getCourseName(course_id) {
    const sqlQuery = `SELECT course_name, abbreviation FROM courses INNER JOIN exams ON exams.id = exam
        WHERE courses.id = ${course_id}`;
    const [[course]] = await pool.query(sqlQuery);

    return course;
}

// Get all courses
export async function getCourses() {
    const sqlQuery = `SELECT courses.id, course_name, abbreviation, price FROM courses INNER JOIN exams on exams.id = exam
    ORDER BY id`
    const [courses] = await pool.query(sqlQuery);
    return courses;
}

// Get a single course
export async function getCourse(id) {
    const sqlQuery = `SELECT courses.id, course_name, abbreviation, price FROM courses INNER JOIN exams on exams.id = exam
    WHERE courses.id = ${id}`;
    const [[courses]] = await pool.query(sqlQuery);
    return courses;
}

// Get all teachers
export async function getTeachers() {
    const sqlQuery = `SELECT * FROM teachers ORDER BY id ASC`;
    const [teachers] = await pool.query(sqlQuery);

    // Iterate over the returned records
    for (let teacher of teachers) {
        for (let key in teacher) {
            // Iterate over the teacher object and update the "courses" property 1-3 with the appropriate course name
            if (key.split('_').includes('course') && teacher[key]) {
                teacher[key] = `${(await getCourseName(teacher[key])).course_name}  (${(await getCourseName(teacher[key])).abbreviation})`;
            }
        }
    }

    return teachers;
}

// Get a single teachers
export async function getTeacher(id) {
    const sqlQuery = `SELECT * FROM teachers WHERE id = ${id}`;
    const [[teacher]] = await pool.query(sqlQuery);

    // Iterate over the teacher object and update the "courses" property 1-3 with the appropriate course name
    for (let key in teacher) {
        if (key.split('_').includes('course') && teacher[key]) {
            teacher[key] = `${(await getCourseName(teacher[key])).course_name}  (${(await getCourseName(teacher[key])).abbreviation})`;
        }
    }

    return teacher;
}

// Get a single student
export async function getStudent(id) {
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

    return student;
}

// Get all students
export async function getStudents() {
    const sqlQuery = `SELECT * FROM students ORDER BY id ASC`;
    const [students] = await pool.query(sqlQuery);

    // Iterate over the returned records
    for (let student of students) {
        student.balance = await getBalance(student.id); // Calculate the student's balance

        // Iterate over the student object and update the "courses" property 1-3 with the appropriate course name
        for (let key in student) {
            if (key.split('_').includes('course')) {
                student[key] = `${(await getCourseName(student[key])).course_name}  (${(await getCourseName(student[key])).abbreviation})`;
            }
        }
    }
    
    return students;
}

// Add a payment to the payments table
export async function addPayment(student_id, amount) {
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

    return result.affectedRows;
}

// Add a student
export async function addStudent(student) {
    const sqlQuery = ` INSERT INTO students (first_nm, last_nm, email, course_one, course_two, course_three) 
        VALUES ('${student.first_nm}', '${student.last_nm}', '${student.email}', '${student.course_one}', 
        ${student.course_two}, ${student.course_three})`;
    
    const [results] = await pool.query(sqlQuery);
    return results.insertId;
}

// Add a teacher 
export async function addTeacher(teacher) {
    const sqlQuery = (teacher.course_two) ? `INSERT INTO teachers (first_nm, last_nm, email, course_one, course_two) VALUES 
    ('${teacher.first_nm}', '${teacher.last_nm}', '${teacher.email}', '${teacher.course_one}', '${teacher.course_two}')` 
        : 
    `INSERT INTO teachers (first_nm, last_nm, email, course_one) VALUES 
    ('${teacher.first_nm}', '${teacher.last_nm}', '${teacher.email}', '${teacher.course_one}')`;

    const [result] = await pool.query(sqlQuery);
    return result.insertId;
}

// Add a course
export async function addCourse(name, exam_id) {
    const [result] = await pool.query('INSERT INTO courses (course_name, exam) VALUES (?, ?)', [name, exam_id]);
    return result.insertId;
}

// Edit teacher
export async function editTeacher(teacher) {
    let result;
    if (teacher.course_two) {
        [result] = await pool.query (`UPDATE teachers SET first_nm = ?, last_nm = ?, email = ?, course_one = ?, course_two = ? 
        WHERE id = ?`, [teacher.first_nm, teacher.last_nm, teacher.email, teacher.course_one, teacher.course_two, teacher.id]);
    }
    else {
        [result] = await pool.query (`UPDATE teachers SET first_nm = ?, last_nm = ?, email = ?, course_one = ?, course_two = ?
         WHERE id = ?`, [teacher.first_nm, teacher.last_nm, teacher.email, teacher.course_one, null, teacher.id]);
    }
    
    return [result][0].info;
}
