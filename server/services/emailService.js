const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Initialize nodemailer transporter
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  // Graceful fallback for local development if SMTP credentials are not yet configured in .env
  return {
    sendMail: async (mailOptions) => {
      console.log('--- [MOCK EMAIL DISPATCH] ---');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('From:', mailOptions.from);
      if (mailOptions.attachments?.length) {
        console.log('Attachments:', mailOptions.attachments.map((a) => a.filename).join(', '));
      }
      console.log('[Notice] Set SMTP_USER and SMTP_PASS in server/.env to send live emails via SMTP.');
      console.log('------------------------------');
      return { messageId: `mock-${Date.now()}` };
    }
  };
};

/**
 * Send quotation notification email to ipmexim@gmail.com with all quotation info
 */
const sendNewQuotationNotification = async (quotation, attachmentPath) => {
  const recipient = process.env.NOTIFICATION_EMAIL || 'ipmexim@gmail.com';
  const fromAddress = process.env.EMAIL_FROM || '"IPM Exim Portal" <no-reply@ipmexim.com>';
  const transporter = createTransporter();

  const attachments = [];
  if (attachmentPath && fs.existsSync(attachmentPath)) {
    attachments.push({
      filename: quotation.attachment?.originalName || path.basename(attachmentPath),
      path: attachmentPath
    });
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0c10; color: #e5e5e5; margin: 0; padding: 20px; }
        .container { max-width: 650px; margin: 0 auto; background: #16181d; border: 1px solid #c5a059; border-radius: 8px; overflow: hidden; }
        .header { background: #1f2229; padding: 25px; border-bottom: 2px solid #c5a059; text-align: center; }
        .header h1 { margin: 0; color: #c5a059; font-size: 22px; text-transform: uppercase; letter-spacing: 1.5px; }
        .header p { margin: 5px 0 0 0; color: #9da3af; font-size: 13px; }
        .content { padding: 25px; }
        .alert-box { background: rgba(197, 160, 89, 0.1); border-left: 4px solid #c5a059; padding: 12px 15px; margin-bottom: 20px; font-size: 14px; color: #f3f4f6; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { text-align: left; padding: 12px 10px; border-bottom: 1px solid #282c37; font-size: 14px; }
        th { color: #c5a059; width: 38%; font-weight: 600; vertical-align: top; }
        td { color: #f3f4f6; }
        .specs-box { background: #0f1115; border: 1px solid #282c37; border-radius: 4px; padding: 12px; margin-top: 5px; white-space: pre-wrap; font-family: inherit; font-size: 13px; color: #d1d5db; }
        .footer { background: #111317; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #22252e; }
        .tag { display: inline-block; background: #252833; color: #c5a059; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>IPM Exim Global</h1>
          <p>Export Sourcing Enquiry Desk</p>
        </div>
        <div class="content">
          <div class="alert-box">
            <strong>New Sourcing Enquiry / Quotation Request Received</strong><br/>
            A new commercial inquiry was submitted via the website portal.
          </div>
          <table>
            <tr><th>Client Full Name:</th><td><strong>${quotation.fullName}</strong></td></tr>
            <tr><th>Corporate Email:</th><td><a href="mailto:${quotation.corporateEmail}" style="color: #c5a059;">${quotation.corporateEmail}</a></td></tr>
            <tr><th>Company / Entity:</th><td>${quotation.company || '<em>Not provided</em>'}</td></tr>
            <tr><th>Phone / WhatsApp:</th><td>${quotation.phoneWhatsApp || '<em>Not provided</em>'}</td></tr>
            <tr><th>Destination Country:</th><td><strong>${quotation.destinationCountry}</strong></td></tr>
            <tr><th>Destination Port:</th><td>${quotation.destinationPort}</td></tr>
            <tr><th>Product of Interest:</th><td><span class="tag">${quotation.productOfInterest || 'General Sourcing'}</span></td></tr>
            <tr><th>Estimated Quantity:</th><td><strong>${quotation.estimatedQuantity} ${quotation.unit || ''}</strong></td></tr>
            <tr><th>Preferred Incoterm:</th><td>${quotation.preferredIncoterm || '<em>Not specified</em>'}</td></tr>
            <tr>
              <th>Technical Specs & Notes:</th>
              <td><div class="specs-box">${quotation.technicalSpecifications}</div></td>
            </tr>
            <tr>
              <th>Drawing / Specification File:</th>
              <td>${quotation.attachment ? `Attached: <strong>${quotation.attachment.originalName}</strong> (${Math.round(quotation.attachment.size / 1024)} KB)` : '<em>No file attached</em>'}</td>
            </tr>
            <tr><th>Consent Granted:</th><td>Yes &bull; User checked commercial enquiry agreement</td></tr>
            <tr><th>Submission ID:</th><td><code>${quotation._id}</code></td></tr>
            <tr><th>Timestamp:</th><td>${new Date(quotation.createdAt || Date.now()).toUTCString()}</td></tr>
          </table>
        </div>
        <div class="footer">
          IPM Exim Global &copy; 2026 | Direct Commercial Channel Notification
        </div>
      </div>
    </body>
    </html>
  `;

  return await transporter.sendMail({
    from: fromAddress,
    to: recipient,
    subject: `[New Quotation] ${quotation.productOfInterest || 'Sourcing Enquiry'} from ${quotation.fullName} (${quotation.destinationCountry})`,
    html: htmlContent,
    attachments
  });
};

/**
 * Send email from Admin to Customer
 */
const sendEmailToCustomer = async ({ to, subject, message, html, adminName, quotationId, attachmentPath }) => {
  const fromAddress = process.env.EMAIL_FROM || '"IPM Exim Global" <ipmexim@gmail.com>';
  const transporter = createTransporter();

  const formattedHtml = html || `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f8fa; color: #222; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; overflow: hidden; }
        .header { background: #16181d; padding: 25px; border-bottom: 3px solid #c5a059; text-align: center; }
        .header h1 { margin: 0; color: #c5a059; font-size: 22px; text-transform: uppercase; letter-spacing: 1.5px; }
        .header p { margin: 5px 0 0 0; color: #9da3af; font-size: 13px; }
        .content { padding: 30px 25px; line-height: 1.6; font-size: 15px; color: #333333; }
        .message-body { background: #fdfdfd; border-left: 3px solid #c5a059; padding: 15px 18px; margin: 15px 0; border-radius: 3px; font-size: 14px; white-space: pre-wrap; }
        .footer { background: #f1f3f5; padding: 15px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #e1e4e8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>IPM Exim Global</h1>
          <p>Direct Commercial Channel &bull; Global Sourcing</p>
        </div>
        <div class="content">
          ${message ? `<div class="message-body">${message}</div>` : ''}
          <p style="margin-top: 25px; font-size: 14px; color: #555;">
            Warm regards,<br/>
            <strong>${adminName || 'Commercial Trade Desk'}</strong><br/>
            IPM Exim Global<br/>
            <a href="mailto:ipmexim@gmail.com" style="color: #c5a059;">ipmexim@gmail.com</a>
          </p>
        </div>
        <div class="footer">
          This message is in response to your export sourcing enquiry on IPM Exim Global.<br/>
          ${quotationId ? `Reference ID: ${quotationId}` : ''}
        </div>
      </div>
    </body>
    </html>
  `;

  const attachments = [];
  if (attachmentPath && fs.existsSync(attachmentPath)) {
    attachments.push({
      filename: path.basename(attachmentPath),
      path: attachmentPath
    });
  }

  return await transporter.sendMail({
    from: fromAddress,
    to,
    replyTo: 'ipmexim@gmail.com',
    subject: subject || 'Response regarding your IPM Exim Sourcing Enquiry',
    text: message,
    html: formattedHtml,
    attachments
  });
};

/**
 * Send automatic confirmation email to customer with a copy of all information they filled in the form
 */
const sendCustomerQuotationConfirmation = async (quotation, attachmentPath) => {
  const recipient = quotation.corporateEmail;
  const fromAddress = process.env.EMAIL_FROM || '"IPM Exim Global" <ipmexim@gmail.com>';
  const transporter = createTransporter();

  const attachments = [];
  if (attachmentPath && fs.existsSync(attachmentPath)) {
    attachments.push({
      filename: quotation.attachment?.originalName || path.basename(attachmentPath),
      path: attachmentPath
    });
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0c10; color: #e5e5e5; margin: 0; padding: 20px; }
        .container { max-width: 650px; margin: 0 auto; background: #16181d; border: 1px solid #c5a059; border-radius: 8px; overflow: hidden; }
        .header { background: #1f2229; padding: 25px; border-bottom: 2px solid #c5a059; text-align: center; }
        .header h1 { margin: 0; color: #c5a059; font-size: 22px; text-transform: uppercase; letter-spacing: 1.5px; }
        .header p { margin: 5px 0 0 0; color: #9da3af; font-size: 13px; }
        .content { padding: 25px; }
        .greeting { font-size: 16px; color: #ffffff; margin-bottom: 15px; }
        .alert-box { background: rgba(197, 160, 89, 0.12); border-left: 4px solid #c5a059; padding: 14px 16px; margin-bottom: 22px; font-size: 14px; color: #f3f4f6; border-radius: 0 4px 4px 0; }
        .table-title { font-size: 15px; font-weight: 600; color: #c5a059; margin-top: 20px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 5px; }
        th, td { text-align: left; padding: 12px 10px; border-bottom: 1px solid #282c37; font-size: 14px; }
        th { color: #c5a059; width: 38%; font-weight: 600; vertical-align: top; }
        td { color: #f3f4f6; }
        .specs-box { background: #0f1115; border: 1px solid #282c37; border-radius: 4px; padding: 12px; margin-top: 5px; white-space: pre-wrap; font-family: inherit; font-size: 13px; color: #d1d5db; }
        .guarantee-box { background: #13151a; border: 1px dashed #3a3f4d; border-radius: 4px; padding: 14px; margin-top: 22px; font-size: 13px; color: #9ca3af; }
        .footer { background: #111317; padding: 18px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #22252e; }
        .tag { display: inline-block; background: #252833; color: #c5a059; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>IPM Exim Global</h1>
          <p>Direct Commercial Channel &bull; Export Sourcing Desk</p>
        </div>
        <div class="content">
          <div class="greeting">Dear <strong>${quotation.fullName}</strong>,</div>
          
          <div class="alert-box">
            <strong>Thank you for submitting your Export Sourcing Enquiry.</strong><br/>
            We have successfully received your commercial inquiry. Our specialized trade desk is evaluating your specifications and will respond with initial specification feedback within <strong>24 business hours</strong>.
          </div>

          <div class="table-title">Summary of Your Submitted Enquiry</div>
          <table>
            <tr><th>Full Name:</th><td><strong>${quotation.fullName}</strong></td></tr>
            <tr><th>Corporate Email:</th><td>${quotation.corporateEmail}</td></tr>
            <tr><th>Company / Entity:</th><td>${quotation.company || '<em>Not provided</em>'}</td></tr>
            <tr><th>Phone / WhatsApp:</th><td>${quotation.phoneWhatsApp || '<em>Not provided</em>'}</td></tr>
            <tr><th>Destination Country:</th><td><strong>${quotation.destinationCountry}</strong></td></tr>
            <tr><th>Destination Port:</th><td>${quotation.destinationPort}</td></tr>
            <tr><th>Product of Interest:</th><td><span class="tag">${quotation.productOfInterest || 'General Sourcing'}</span></td></tr>
            <tr><th>Estimated Quantity:</th><td><strong>${quotation.estimatedQuantity} ${quotation.unit || ''}</strong></td></tr>
            <tr><th>Preferred Incoterm:</th><td>${quotation.preferredIncoterm || '<em>Not specified</em>'}</td></tr>
            <tr>
              <th>Technical Specifications & Notes:</th>
              <td><div class="specs-box">${quotation.technicalSpecifications}</div></td>
            </tr>
            <tr>
              <th>Attached Specification / Drawing:</th>
              <td>${quotation.attachment ? `<strong>${quotation.attachment.originalName}</strong>` : '<em>None attached</em>'}</td>
            </tr>
            <tr><th>Reference Inquiry ID:</th><td><code>${quotation._id}</code></td></tr>
            <tr><th>Submission Timestamp:</th><td>${new Date(quotation.createdAt || Date.now()).toUTCString()}</td></tr>
          </table>

          <div class="guarantee-box">
            <strong style="color: #c5a059;">Buyer Confidentiality Guarantee:</strong><br/>
            All drawings, formulations, and commercial quantities shared with IPM Exim are safeguarded by mutual B2B trade discretion.
          </div>
        </div>
        <div class="footer">
          IPM Exim Global &bull; International Trade Sourcing &bull; India Origin Gateway<br/>
          Official Commercial Desk: <a href="mailto:ipmexim@gmail.com" style="color: #c5a059;">ipmexim@gmail.com</a>
        </div>
      </div>
    </body>
    </html>
  `;

  return await transporter.sendMail({
    from: fromAddress,
    to: recipient,
    replyTo: 'ipmexim@gmail.com',
    subject: `[IPM Exim] Export Sourcing Enquiry Confirmation (Ref: ${quotation._id})`,
    html: htmlContent,
    attachments
  });
};

module.exports = {
  sendNewQuotationNotification,
  sendEmailToCustomer,
  sendCustomerQuotationConfirmation
};
