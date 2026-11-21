const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

/**
 * Locate the official IPM Exim logo on disk and prepare attachment for inline CID display
 */
const getLogoAttachment = () => {
  const potentialPaths = [
    path.resolve(__dirname, '../assets/logo.png'),
    path.resolve(__dirname, '../../assets/logo.png'),
    path.resolve(__dirname, '../../frontend/public/logo.png'),
    path.resolve(__dirname, '../public/logo.png')
  ];

  for (const p of potentialPaths) {
    if (fs.existsSync(p)) {
      return {
        filename: 'ipm-exim-logo.png',
        path: p,
        cid: 'ipmexim-logo' // Referenced in HTML as <img src="cid:ipmexim-logo" />
      };
    }
  }
  return null;
};

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

  // Graceful fallback for local development if SMTP credentials are not yet configured
  return {
    sendMail: async (mailOptions) => {
      console.log('--- [MOCK EMAIL DISPATCH] ---');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('From:', mailOptions.from);
      if (mailOptions.attachments?.length) {
        console.log('Attachments:', mailOptions.attachments.map((a) => a.filename).join(', '));
      }
      console.log('------------------------------');
      return { messageId: `mock-${Date.now()}` };
    }
  };
};

/**
 * 1. Send quotation notification email to admin (ipmexim@gmail.com) with ALL customer-submitted information + logo
 */
const sendNewQuotationNotification = async (quotation, attachmentPath) => {
  const recipient = process.env.NOTIFICATION_EMAIL || 'ipmexim@gmail.com';
  const fromAddress = process.env.EMAIL_FROM || '"IPM Exim Portal" <ipmexim@gmail.com>';
  const transporter = createTransporter();

  const attachments = [];
  
  // Embed official brand logo as inline CID attachment
  const logo = getLogoAttachment();
  if (logo) {
    attachments.push(logo);
  }

  // Attach any user uploaded specification file
  if (attachmentPath && typeof attachmentPath === 'string') {
    if (attachmentPath.startsWith('http://') || attachmentPath.startsWith('https://')) {
      attachments.push({
        filename: quotation.attachment?.originalName || 'specification-document',
        path: attachmentPath
      });
    } else if (fs.existsSync(attachmentPath)) {
      attachments.push({
        filename: quotation.attachment?.originalName || path.basename(attachmentPath),
        path: attachmentPath
      });
    }
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0c10; color: #e5e5e5; margin: 0; padding: 20px; }
        .container { max-width: 650px; margin: 0 auto; background: #16181d; border: 1px solid #c5a059; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { background: #121319; padding: 25px 20px; border-bottom: 2px solid #c5a059; text-align: center; }
        .header img { height: 60px; max-width: 180px; width: auto; display: block; margin: 0 auto 10px auto; }
        .header h1 { margin: 0; color: #c5a059; font-size: 24px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: normal; }
        .header p { margin: 4px 0 0 0; color: #9da3af; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; }
        .content { padding: 25px; }
        .alert-box { background: rgba(197, 160, 89, 0.12); border-left: 4px solid #c5a059; padding: 12px 15px; margin-bottom: 20px; font-size: 14px; color: #f3f4f6; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { text-align: left; padding: 12px 10px; border-bottom: 1px solid #282c37; font-size: 14px; }
        th { color: #c5a059; width: 38%; font-weight: 600; vertical-align: top; }
        td { color: #f3f4f6; }
        .specs-box { background: #0f1115; border: 1px solid #282c37; border-radius: 4px; padding: 12px; margin-top: 5px; white-space: pre-wrap; font-family: inherit; font-size: 13px; color: #d1d5db; }
        .footer { background: #111317; padding: 16px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #22252e; }
        .tag { display: inline-block; background: #252833; color: #c5a059; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; border: 1px solid rgba(197, 160, 89, 0.3); }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${logo ? `<img src="cid:ipmexim-logo" alt="IPM Exim Logo" />` : ''}
          <h1>IPM Exim</h1>
          <p>Export Sourcing Enquiry Desk &bull; Administrator Notification</p>
        </div>
        <div class="content">
          <div class="alert-box">
            <strong>New Commercial Quotation Request Received</strong><br/>
            A customer has submitted a formal inquiry on the website with the details below.
          </div>
          <table>
            <tr><th>Client Full Name:</th><td><strong>${quotation.fullName}</strong></td></tr>
            <tr><th>Client Corporate Email:</th><td><a href="mailto:${quotation.corporateEmail}" style="color: #c5a059; font-weight: bold;">${quotation.corporateEmail}</a></td></tr>
            <tr><th>Company / Organization:</th><td>${quotation.company || '<em>Not provided</em>'}</td></tr>
            <tr><th>Phone / WhatsApp:</th><td>${quotation.phoneWhatsApp || '<em>Not provided</em>'}</td></tr>
            <tr><th>Destination Country:</th><td><strong>${quotation.destinationCountry}</strong></td></tr>
            <tr><th>Destination Port:</th><td>${quotation.destinationPort || '<em>As per country</em>'}</td></tr>
            <tr><th>Product Line / Requirement:</th><td><span class="tag">${quotation.productOfInterest || 'General Commodity Sourcing'}</span></td></tr>
            <tr><th>Estimated Quantity:</th><td><strong>${quotation.estimatedQuantity} ${quotation.unit || ''}</strong></td></tr>
            <tr><th>Preferred Incoterm:</th><td>${quotation.preferredIncoterm || 'FOB / CIF'}</td></tr>
            <tr>
              <th>Buyer Specifications & Notes:</th>
              <td><div class="specs-box">${quotation.technicalSpecifications || 'Standard Export Quality Required'}</div></td>
            </tr>
            <tr>
              <th>Attached Drawing / File:</th>
              <td>${quotation.attachment ? `Attached: <strong>${quotation.attachment.originalName}</strong> (${Math.round(quotation.attachment.size / 1024)} KB)` : '<em>No file attached</em>'}</td>
            </tr>
            <tr><th>Quotation ID:</th><td><code style="color: #c5a059;">${quotation._id}</code></td></tr>
            <tr><th>Timestamp:</th><td>${new Date(quotation.createdAt || Date.now()).toUTCString()}</td></tr>
          </table>
        </div>
        <div class="footer">
          IPM Exim &copy; 2026 &bull; Direct Commercial Channel Notification &bull; <a href="mailto:ipmexim@gmail.com" style="color: #c5a059;">ipmexim@gmail.com</a>
        </div>
      </div>
    </body>
    </html>
  `;

  return await transporter.sendMail({
    from: fromAddress,
    to: recipient,
    replyTo: quotation.corporateEmail,
    subject: `[New Quotation] ${quotation.productOfInterest || 'Sourcing Requirement'} from ${quotation.fullName} (${quotation.destinationCountry})`,
    html: htmlContent,
    attachments
  });
};

/**
 * 2. Send automatic confirmation email to the customer with all the information they filled in the form + logo
 */
const sendCustomerQuotationConfirmation = async (quotation, attachmentPath) => {
  const recipient = quotation.corporateEmail;
  if (!recipient) {
    console.warn('[Confirmation Skip] No recipient email found for quotation:', quotation._id);
    return;
  }

  const fromAddress = process.env.EMAIL_FROM || '"IPM Exim" <ipmexim@gmail.com>';
  const transporter = createTransporter();

  const attachments = [];
  
  // Embed official brand logo as inline CID attachment
  const logo = getLogoAttachment();
  if (logo) {
    attachments.push(logo);
  }

  if (attachmentPath && typeof attachmentPath === 'string') {
    if (attachmentPath.startsWith('http://') || attachmentPath.startsWith('https://')) {
      attachments.push({
        filename: quotation.attachment?.originalName || 'specification-document',
        path: attachmentPath
      });
    } else if (fs.existsSync(attachmentPath)) {
      attachments.push({
        filename: quotation.attachment?.originalName || path.basename(attachmentPath),
        path: attachmentPath
      });
    }
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0c10; color: #e5e5e5; margin: 0; padding: 20px; }
        .container { max-width: 650px; margin: 0 auto; background: #16181d; border: 1px solid #c5a059; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { background: #121319; padding: 25px 20px; border-bottom: 2px solid #c5a059; text-align: center; }
        .header img { height: 60px; max-width: 180px; width: auto; display: block; margin: 0 auto 10px auto; }
        .header h1 { margin: 0; color: #c5a059; font-size: 24px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: normal; }
        .header p { margin: 4px 0 0 0; color: #9da3af; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; }
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
        .tag { display: inline-block; background: #252833; color: #c5a059; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; border: 1px solid rgba(197, 160, 89, 0.3); }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${logo ? `<img src="cid:ipmexim-logo" alt="IPM Exim Logo" />` : ''}
          <h1>IPM Exim</h1>
          <p>International Trade House &bull; Export Sourcing Desk</p>
        </div>
        <div class="content">
          <div class="greeting">Dear <strong>${quotation.fullName}</strong>,</div>
          
          <div class="alert-box">
            <strong>Thank you for submitting your Commercial Export Quotation Request.</strong><br/>
            We have successfully received your sourcing enquiry. Our specialized export desk is reviewing your requirements and will dispatch formal proforma terms within <strong>24 business hours</strong>.
          </div>

          <div class="table-title">Copy of Your Submitted Quotation Information</div>
          <table>
            <tr><th>Full Name:</th><td><strong>${quotation.fullName}</strong></td></tr>
            <tr><th>Registered Email:</th><td>${quotation.corporateEmail}</td></tr>
            <tr><th>Company / Organization:</th><td>${quotation.company || '<em>Not provided</em>'}</td></tr>
            <tr><th>Phone / WhatsApp:</th><td>${quotation.phoneWhatsApp || '<em>Not provided</em>'}</td></tr>
            <tr><th>Destination Country:</th><td><strong>${quotation.destinationCountry}</strong></td></tr>
            <tr><th>Destination Port:</th><td>${quotation.destinationPort || '<em>As per country</em>'}</td></tr>
            <tr><th>Product Line / Requirement:</th><td><span class="tag">${quotation.productOfInterest || 'General Sourcing'}</span></td></tr>
            <tr><th>Estimated Quantity:</th><td><strong>${quotation.estimatedQuantity} ${quotation.unit || ''}</strong></td></tr>
            <tr><th>Preferred Incoterm:</th><td>${quotation.preferredIncoterm || 'FOB / CIF'}</td></tr>
            <tr>
              <th>Specifications & Requirements:</th>
              <td><div class="specs-box">${quotation.technicalSpecifications || 'Standard Export Quality'}</div></td>
            </tr>
            <tr>
              <th>Attached File / Drawing:</th>
              <td>${quotation.attachment ? `<strong>${quotation.attachment.originalName}</strong>` : '<em>None attached</em>'}</td>
            </tr>
            <tr><th>Tracking Reference Code:</th><td><code style="color: #c5a059; font-weight: bold;">${quotation._id}</code></td></tr>
            <tr><th>Submission Timestamp:</th><td>${new Date(quotation.createdAt || Date.now()).toUTCString()}</td></tr>
          </table>

          <div class="guarantee-box">
            <strong style="color: #c5a059;">Buyer Commercial Discretion:</strong><br/>
            All trade specifications, formulation details, and estimated volume parameters shared with IPM Exim are safeguarded in accordance with international export data practices.
          </div>
        </div>
        <div class="footer">
          IPM Exim &bull; International Trade Sourcing &bull; India Origin Gateway<br/>
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
    subject: `[IPM Exim] Commercial Export Quotation Confirmation (Ref: ${quotation._id})`,
    html: htmlContent,
    attachments
  });
};

/**
 * 3. Send email from Admin to Customer (with official Logo embedded)
 */
const sendEmailToCustomer = async ({ to, subject, message, html, adminName, quotationId, attachmentPath }) => {
  const fromAddress = process.env.EMAIL_FROM || '"IPM Exim" <ipmexim@gmail.com>';
  const transporter = createTransporter();

  const attachments = [];

  // Embed official brand logo as inline CID attachment
  const logo = getLogoAttachment();
  if (logo) {
    attachments.push(logo);
  }

  if (attachmentPath && fs.existsSync(attachmentPath)) {
    attachments.push({
      filename: path.basename(attachmentPath),
      path: attachmentPath
    });
  }

  const formattedHtml = html || `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0c10; color: #e5e5e5; margin: 0; padding: 20px; }
        .container { max-width: 650px; margin: 0 auto; background: #16181d; border: 1px solid #c5a059; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { background: #121319; padding: 25px 20px; border-bottom: 2px solid #c5a059; text-align: center; }
        .header img { height: 60px; max-width: 180px; width: auto; display: block; margin: 0 auto 10px auto; }
        .header h1 { margin: 0; color: #c5a059; font-size: 24px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: normal; }
        .header p { margin: 4px 0 0 0; color: #9da3af; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; }
        .content { padding: 30px 25px; line-height: 1.6; font-size: 14px; color: #f3f4f6; }
        .message-body { background: #0f1115; border-left: 3px solid #c5a059; padding: 18px 20px; margin: 18px 0; border-radius: 4px; font-size: 14px; white-space: pre-wrap; color: #e5e5e5; border: 1px solid #282c37; border-left: 4px solid #c5a059; }
        .footer { background: #111317; padding: 18px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #22252e; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${logo ? `<img src="cid:ipmexim-logo" alt="IPM Exim Logo" />` : ''}
          <h1>IPM Exim</h1>
          <p>Direct Commercial Channel &bull; Global Export Sourcing</p>
        </div>
        <div class="content">
          ${message ? `<div class="message-body">${message}</div>` : ''}
          <p style="margin-top: 25px; font-size: 14px; color: #9da3af;">
            Warm regards,<br/>
            <strong style="color: #ffffff;">${adminName || 'Commercial Trade Desk'}</strong><br/>
            <span style="color: #c5a059;">IPM Exim</span><br/>
            <a href="mailto:ipmexim@gmail.com" style="color: #c5a059;">ipmexim@gmail.com</a>
          </p>
        </div>
        <div class="footer">
          This communication is dispatched in reference to your export sourcing enquiry with IPM Exim.<br/>
          ${quotationId ? `Reference ID: <strong style="color: #c5a059;">${quotationId}</strong>` : ''}
        </div>
      </div>
    </body>
    </html>
  `;

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

module.exports = {
  getLogoAttachment,
  sendNewQuotationNotification,
  sendEmailToCustomer,
  sendCustomerQuotationConfirmation
};
