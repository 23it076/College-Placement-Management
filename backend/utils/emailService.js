const nodemailer = require('nodemailer');

const sendEmail = async (studentEmail, status, companyName, studentName) => {
    try {
        // Create reusable transporter using environment variables
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const isHired = status.toLowerCase() === 'hired';
        const subject = isHired
            ? `Congratulations! Job Offer: ${companyName}`
            : `Interview Shortlist: ${companyName}`;

        const htmlContent = isHired
            ? `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; border: 2px solid #4ade80; border-radius: 8px; max-width: 600px; margin: auto;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #16a34a; margin: 0;">🎉 Congratulations! 🎉</h1>
                </div>
                <p>Hello <strong>${studentName}</strong>,</p>
                <p>We are thrilled to inform you that you have been <strong>HIRED</strong> by <strong>${companyName}</strong>!</p>
                <p>Your hard work has paid off. Log in to your dashboard to review the next steps.</p>
                <br/>
                <p>Best regards,<br/>Placement Cell</p>
            </div>
            `
            : `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto;">
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
            from: `"Placement Cell" <${process.env.EMAIL_USER}>`,
            to: studentEmail,
            subject: subject,
            html: htmlContent,
        });

        console.log(`\n========================================================`);
        console.log(`✉️  EMAIL SENT TO: ${studentEmail}`);
        console.log(`📄  SUBJECT: ${subject}`);
        console.log(`========================================================\n`);

        return info;
    } catch (error) {
        console.error('Email Dispatch Error:', error);
    }
};

module.exports = { sendEmail };
