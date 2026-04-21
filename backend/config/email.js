const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Doctor Approval Email
const sendDoctorApprovalEmail = async (doctor) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 30px;">
      <div style="background: #0c3812; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🏥 Behealthy Hospital</h1>
      </div>
      <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
        <h2 style="color: #0c3812; margin-bottom: 16px;">Congratulations, ${doctor.fullName}!</h2>
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
          Your doctor account has been <strong style="color: #16a34a;">approved</strong> by the hospital administration.
        </p>
        <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0; color: #166534; font-weight: bold;">Account Details</p>
          <p style="margin: 8px 0 0; color: #166534;">Specialization: ${doctor.specialization}</p>
          <p style="margin: 4px 0 0; color: #166534;">License Number: ${doctor.licenseNumber}</p>
        </div>
        <p style="color: #6b7280; font-size: 16px;">You can now log in to the doctor portal and start managing your sessions and patients.</p>
        <a href="${process.env.FRONTEND_URL}/doctor" style="display: inline-block; background: #0c3812; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">
          Login to Doctor Portal →
        </a>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">© 2026 Behealthy Hospital. All rights reserved.</p>
      </div>
    </div>
  `;
  return sendEmail({ to: doctor.email, subject: '✅ Your Doctor Account Has Been Approved - Behealthy Hospital', html });
};

// Doctor Rejection Email
const sendDoctorRejectionEmail = async (doctor, reason) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 30px;">
      <div style="background: #0a2540; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🏥 Behealthy Hospital</h1>
      </div>
      <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
        <h2 style="color: #0a2540;">Application Update, ${doctor.fullName}</h2>
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
          After careful review, we regret to inform you that your application has not been approved at this time.
        </p>
        ${reason ? `<div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0; color: #991b1b; font-weight: bold;">Reason:</p>
          <p style="margin: 8px 0 0; color: #991b1b;">${reason}</p>
        </div>` : ''}
        <p style="color: #6b7280;">Please contact the hospital administration for more information.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">© 2026 Behealthy Hospital. All rights reserved.</p>
      </div>
    </div>
  `;
  return sendEmail({ to: doctor.email, subject: '❌ Application Status Update - Behealthy Hospital', html });
};

// Appointment Confirmation Email
const sendAppointmentConfirmationEmail = async (patient, appointment) => {
  const confirmUrl = `${process.env.FRONTEND_URL}/confirm-appointment/${appointment._id}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 30px;">
      <div style="background: #0a2540; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🏥 Behealthy Hospital</h1>
      </div>
      <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
        <h2 style="color: #0a2540;">Appointment Reminder, ${patient.fullName}!</h2>
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
          Your appointment is scheduled for <strong>tomorrow</strong>. Please confirm your attendance.
        </p>
        <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0; color: #1e40af; font-weight: bold;">Appointment Details</p>
          <p style="margin: 8px 0 0; color: #1e40af;">Ticket: #${appointment.ticketNumber}</p>
          <p style="margin: 4px 0 0; color: #1e40af;">Doctor: ${appointment.doctorName}</p>
          <p style="margin: 4px 0 0; color: #1e40af;">Department: ${appointment.department}</p>
        </div>
        <a href="${confirmUrl}" style="display: inline-block; background: #0a2540; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; margin-top: 8px;">
          ✅ Confirm My Attendance
        </a>
        <p style="color: #9ca3af; font-size: 13px; margin-top: 20px;">If you cannot attend, please cancel your appointment in the patient portal.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">© 2026 Behealthy Hospital. All rights reserved.</p>
      </div>
    </div>
  `;
  return sendEmail({ to: patient.email, subject: '🔔 Appointment Reminder & Confirmation Required - Behealthy Hospital', html });
};

module.exports = { sendEmail, sendDoctorApprovalEmail, sendDoctorRejectionEmail, sendAppointmentConfirmationEmail };
