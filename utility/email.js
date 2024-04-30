import ejs from 'ejs';
import nodemailer from 'nodemailer';
// import {htmlToText} from 'html-to-text';
import path from 'path';
import dotenv from 'dotenv';
import {dirname} from 'path';
import { fileURLToPath } from 'url';

dotenv.config({path: './config.env'});

const __dirname = dirname(fileURLToPath(import.meta.url));

export class Email {
    // Location of the email template(s)
    #templateURL = path.join(__dirname, '../views/');

    constructor(student) {
        this.to = student.email,
        // this.first_name = customer.frst_nm,
        // this.last_name = customer.last_nm,
        this.from = `help@studentmanagement.com`
    }

    // Configure Nodemailer
    createMailTransport() {
        if (process.env.NODE_ENV !== 'production') {
            // Use Mailtrap
            return nodemailer.createTransport({
                host: 'smtp.mailtrap.io',
                port: 2525,
                auth: {
                    user: process.env.MAILTRAP_USER,
                    pass: process.env.MAILTRAP_PASS
                }
            });
        }
        else {
            // Use a live Mail Server
            return nodemailer.createTransport({
                host: 'smtp.mail.yahoo.com',
                port:  465,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
        }
    }

    // Send the email
    async sendMail(template, subject, student) {
        const transport = this.createMailTransport();
        const html = await ejs.renderFile(this.#templateURL + template + '.ejs', {
            subject,
            baseURL: `${process.env.BASE_URL}`,
            // guest_f_name: this.first_name,
            // guest_last_name: this.last_name,
            ...student
        });
        return await transport.sendMail({
            to: `${this.to}, ${process.env.COPY_EMAIL}`,
            from: transport.options.auth.user,
            subject,
            html,
            // text: htmlToText(html)
        });
    }
}