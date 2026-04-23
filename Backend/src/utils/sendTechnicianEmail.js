import nodemailer from "nodemailer";

export const sendTechnicianEmail = async (techEmail, ticket) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Smart Helpdesk" <${process.env.EMAIL}>`,
      to: techEmail,
      subject: "🔔 New Ticket Assigned to You",
      html: `
        <h3>New Support Ticket Assigned</h3>
        <p><b>Title:</b> ${ticket.title}</p>
        <p><b>Description:</b> ${ticket.description}</p>
        <p><b>Priority:</b> ${ticket.priority}</p>
        <p><b>Status:</b> ${ticket.status}</p>
        <p><b>Ticket ID:</b> ${ticket._id}</p>
        <br />
        <p>Please check your dashboard to respond.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Technician email sent");
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
};
 