import nodemailer from "nodemailer";

export const sendUserResolvedEmail = async (email, ticket) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "✅ Your Support Ticket Has Been Resolved",
    html: `
      <h2>✅ Ticket Resolved</h2>
      <p><b>Title:</b> ${ticket.title}</p>
      <p><b>Description:</b> ${ticket.description}</p>
      <p><b>Solution:</b> ${
        ticket.solutionComment || "No solution comment provided"
      }</p>
      <p><b>Status:</b> Resolved</p>
      <br/>
      <p>Thank you for using our support system.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
