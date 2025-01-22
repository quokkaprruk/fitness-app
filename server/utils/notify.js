require("dotenv").config();
const nodemailer = require("nodemailer");
const logger = require("../middleware/logger");

async function createTestTransporter() {
  const testAccount = await nodemailer.createTestAccount();

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

function createProdTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

/**
 * Notifies user via email
 * @async
 * @param {String} email
 * @param {String} subject
 * @param {String} message
 * @returns {Boolean} true or false
 */
async function notify(email, subject, message) {
  try {
    logger.info(`Attempting to send notification to ${email}`);

    // Determine environment and create appropriate transporter
    const transporter =
      process.env.NODE_ENV === "development"
        ? await createTestTransporter()
        : createProdTransporter();

    const mailOptions = {
      from:
        process.env.NODE_ENV === "development"
          ? '"Test Fitness App" <test@fitnessapp.com>'
          : process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);

    // If in development, log the preview URL
    if (process.env.NODE_ENV === "development") {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    logger.info(`Successfully sent notification to ${email}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send notification to ${email}: ${error.message}`);
    return false;
  }
}

module.exports = { notify };
