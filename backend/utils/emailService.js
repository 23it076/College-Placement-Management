const nodemailer = require('nodemailer');

const sendStatusEmail = async (studentEmail, status, companyName, studentName) => {
    try {
        // Create a test account (Ethereal)
        const testAccount = await nodemailer.createTestAccount();

        // Create reusable transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        const subject = status === 'hired'
            ? `Job Offer: ${companyName}`
            : `Interview Shortlist: ${companyName}`;

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #4f46e5;">Update on your application</h2>
                <p>Hello <strong>${studentName}</strong>,</p>
                <p>We are pleased to inform you that your application status for <strong>${companyName}</strong> has been updated to: <span style="background-color: #e0e7ff; padding: 4px 8px; border-radius: 4px; font-weight: bold; color: #4338ca; text-transform: uppercase;">${status}</span>.</p>
                <p>Please log in to your dashboard for more details.</p>
                <br/>
                <p>Best regards,<br/>Placement Cell</p>
            </div>
        `;

        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Placement Cell" <no-reply@college.edu>',
            to: studentEmail,
            subject: subject,
            html: htmlContent,
        });

        console.log(`\n========================================================`);
        console.log(`✉️  MOCK EMAIL SENT TO: ${studentEmail}`);
        console.log(`📄  SUBJECT: ${subject}`);
        console.log(`🔍  PREVIEW URL: ${nodemailer.getTestMessageUrl(info)}`);
        console.log(`========================================================\n`);

        return info;
    } catch (error) {
        console.error('Email Dispatch Error:', error);
    }
};

module.exports = { sendStatusEmail };
