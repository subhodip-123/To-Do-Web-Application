// Placeholder email service. Plug in nodemailer / SendGrid / SES here.
// Example usage: sendReminder(user, task)

const sendReminder = async (user, task) => {
  // For production, integrate nodemailer:
  // const transporter = nodemailer.createTransport({ ... });
  // await transporter.sendMail({ to: user.email, subject: ..., html: ... });
  console.log(`[email] Reminder for ${user.email} - "${task.title}" due ${task.dueDate}`);
};

module.exports = { sendReminder };
