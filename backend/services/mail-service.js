const nodemailer = require('nodemailer');

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.yandex.ru',
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: 'vladislavlazutchenko@yandex.ru',
                pass: '***'
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: `Account Activation <${process.env.MAIL_SENDER}>`,
            to,
            subject: 'Account activation on ' + process.env.API_URL,
            text: '',
            html:
            `
            <div>
                <h1>Confirm your email address</h1> 
                <p>To activate your account click on the link below:</p>
                <a href="${link}">Activate</a>
                <footer>If It's not you, just ignore the message</footer>   
            </div>
            `
        })
    }
}

module.exports = new MailService();