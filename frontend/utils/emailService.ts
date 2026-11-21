import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

export interface QuotationEmailPayload {
  id: string;
  fullName: string;
  corporateEmail: string;
  company?: string;
  phoneWhatsApp?: string;
  destinationCountry: string;
  destinationPort?: string;
  productOfInterest: string;
  estimatedQuantity: string;
  unit?: string;
  preferredIncoterm?: string;
  technicalSpecifications?: string;
  attachmentName?: string;
  createdAt?: string;
}

// SMTP credentials from configuration or default production secrets
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || 'kotambeharsh@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || 'zytscfewkjyclptj';
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'ipmexim@gmail.com';
const EMAIL_FROM = process.env.EMAIL_FROM || '"IPM Exim Global" <kotambeharsh@gmail.com>';

// Create reusable transporter
const getTransporter = () => {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

// Retrieve logo buffer safely for inline CID embedding
const getLogoAttachment = () => {
  const potentialPaths = [
    path.join(process.cwd(), 'public/logo.png'),
    path.join(process.cwd(), 'frontend/public/logo.png'),
    path.resolve(__dirname, '../../public/logo.png'),
  ];

  for (const p of potentialPaths) {
    if (fs.existsSync(p)) {
      try {
        const content = fs.readFileSync(p);
        return {
          filename: 'ipm-exim-logo.png',
          content,
          cid: 'ipmexim-logo',
        };
      } catch (e) {
        console.warn('Could not read logo buffer:', e);
      }
    }
  }
  return null;
};

/**
 * 1. Send quotation alert email to Admin (ipmexim@gmail.com)
 */
export const sendAdminQuotationAlert = async (quotation: QuotationEmailPayload) => {
  const transporter = getTransporter();
  const attachments: any[] = [];
  const logo = getLogoAttachment();
  if (logo) attachments.push(logo);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0c10; color: #e5e5e5; margin: 0; padding: 20px; }
        .container { max-width: 650px; margin: 0 auto; background: #16181d; border: 1px solid #c5a059; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { background: #121319; padding: 25px 20px; border-bottom: 2px solid #c5a059; text-align: center; }
        .header img { height: 65px; max-width: 180px; width: auto; display: block; margin: 0 auto 10px auto; }
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
          ${logo ? `<img src="cid:ipmexim-logo" alt="IPM Exim Official Logo" />` : `<img src="https://ipmexim-import-export-frontend.vercel.app/logo.png" alt="IPM Exim Logo" />`}
          <h1>IPM Exim</h1>
          <p>Export Sourcing Enquiry Desk &bull; Administrator Notification</p>
        </div>
        <div class="content">
          <div class="alert-box">
            <strong>New Commercial Quotation Request Received</strong><br/>
            A customer has submitted a formal inquiry on the live website with the details below.
          </div>
          <table>
            <tr><th>Client Full Name:</th><td><strong>${quotation.fullName}</strong></td></tr>
            <tr><th>Client Corporate Email:</th><td><a href="mailto:${quotation.corporateEmail}" style="color: #c5a059; font-weight: bold;">${quotation.corporateEmail}</a></td></tr>
            <tr><th>Company / Organization:</th><td>${quotation.company || 'Not provided'}</td></tr>
            <tr><th>Phone / WhatsApp:</th><td>${quotation.phoneWhatsApp || 'Not provided'}</td></tr>
            <tr><th>Destination Country:</th><td><strong>${quotation.destinationCountry}</strong></td></tr>
            <tr><th>Destination Port:</th><td>${quotation.destinationPort || 'As specified in country terms'}</td></tr>
            <tr><th>Product Line / Requirement:</th><td><span class="tag">${quotation.productOfInterest || 'General Commodity Sourcing'}</span></td></tr>
            <tr><th>Estimated Quantity:</th><td><strong>${quotation.estimatedQuantity} ${quotation.unit || ''}</strong></td></tr>
            <tr><th>Preferred Incoterm:</th><td>${quotation.preferredIncoterm || 'FOB / CIF'}</td></tr>
            <tr>
              <th>Buyer Specifications & Notes:</th>
              <td><div class="specs-box">${quotation.technicalSpecifications || 'Standard Export Quality Required'}</div></td>
            </tr>
            <tr><th>Quotation Tracking ID:</th><td><code style="color: #c5a059; font-weight: bold;">${quotation.id}</code></td></tr>
            <tr><th>Timestamp:</th><td>${new Date().toUTCString()}</td></tr>
          </table>
        </div>
        <div class="footer">
          IPM Exim Global &copy; 2026 &bull; Direct Commercial Channel Notification &bull; <a href="mailto:ipmexim@gmail.com" style="color: #c5a059;">ipmexim@gmail.com</a>
        </div>
      </div>
    </body>
    </html>
  `;

  return await transporter.sendMail({
    from: EMAIL_FROM,
    to: NOTIFICATION_EMAIL,
    replyTo: quotation.corporateEmail,
    subject: `[New Quotation] ${quotation.productOfInterest || 'Sourcing Requirement'} from ${quotation.fullName} (${quotation.destinationCountry})`,
    html: htmlContent,
    attachments,
  });
};

/**
 * 2. Send confirmation email to Customer with their submitted info + logo
 */
export const sendCustomerQuotationConfirmation = async (quotation: QuotationEmailPayload) => {
  if (!quotation.corporateEmail) {
    console.warn('[Confirmation Skip] No recipient email specified');
    return;
  }

  const transporter = getTransporter();
  const attachments: any[] = [];
  const logo = getLogoAttachment();
  if (logo) attachments.push(logo);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0c10; color: #e5e5e5; margin: 0; padding: 20px; }
        .container { max-width: 650px; margin: 0 auto; background: #16181d; border: 1px solid #c5a059; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { background: #121319; padding: 25px 20px; border-bottom: 2px solid #c5a059; text-align: center; }
        .header img { height: 65px; max-width: 180px; width: auto; display: block; margin: 0 auto 10px auto; }
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
          ${logo ? `<img src="cid:ipmexim-logo" alt="IPM Exim Official Logo" />` : `<img src="https://ipmexim-import-export-frontend.vercel.app/logo.png" alt="IPM Exim Logo" />`}
          <h1>IPM Exim</h1>
          <p>International Trade House &bull; Export Sourcing Desk</p>
        </div>
        <div class="content">
          <div class="greeting">Dear <strong>${quotation.fullName}</strong>,</div>
          
          <div class="alert-box">
            <strong>Thank you for submitting your Commercial Export Quotation Request.</strong><br/>
            We have successfully received your sourcing enquiry. Our specialized trade desk is reviewing your requirements and will dispatch formal commercial export quotation terms within <strong>24 business hours</strong>.
          </div>

          <div class="table-title">Copy of Your Submitted Quotation Information</div>
          <table>
            <tr><th>Full Name:</th><td><strong>${quotation.fullName}</strong></td></tr>
            <tr><th>Registered Email:</th><td>${quotation.corporateEmail}</td></tr>
            <tr><th>Company / Organization:</th><td>${quotation.company || 'Not provided'}</td></tr>
            <tr><th>Phone / WhatsApp:</th><td>${quotation.phoneWhatsApp || 'Not provided'}</td></tr>
            <tr><th>Destination Country:</th><td><strong>${quotation.destinationCountry}</strong></td></tr>
            <tr><th>Destination Port:</th><td>${quotation.destinationPort || 'As specified in country terms'}</td></tr>
            <tr><th>Product Line / Requirement:</th><td><span class="tag">${quotation.productOfInterest || 'General Sourcing'}</span></td></tr>
            <tr><th>Estimated Quantity:</th><td><strong>${quotation.estimatedQuantity} ${quotation.unit || ''}</strong></td></tr>
            <tr><th>Preferred Incoterm:</th><td>${quotation.preferredIncoterm || 'FOB / CIF'}</td></tr>
            <tr>
              <th>Specifications & Requirements:</th>
              <td><div class="specs-box">${quotation.technicalSpecifications || 'Standard Export Quality'}</div></td>
            </tr>
            <tr><th>Tracking Reference Code:</th><td><code style="color: #c5a059; font-weight: bold;">${quotation.id}</code></td></tr>
            <tr><th>Submission Timestamp:</th><td>${new Date().toUTCString()}</td></tr>
          </table>

          <div class="guarantee-box">
            <strong style="color: #c5a059;">Buyer Commercial Discretion:</strong><br/>
            All trade specifications, formulation details, and estimated volume parameters shared with IPM Exim are safeguarded in accordance with international export data practices.
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
    from: EMAIL_FROM,
    to: quotation.corporateEmail,
    replyTo: NOTIFICATION_EMAIL,
    subject: `[IPM Exim] Commercial Export Quotation Confirmation (Ref: ${quotation.id})`,
    html: htmlContent,
    attachments,
  });
};

/**
 * 3. Send custom direct response email from Admin to Customer
 */
export const sendAdminDirectResponse = async ({
  to,
  subject,
  message,
  adminName,
  quotationId,
}: {
  to: string;
  subject: string;
  message: string;
  adminName?: string;
  quotationId?: string;
}) => {
  const transporter = getTransporter();
  const attachments: any[] = [];
  const logo = getLogoAttachment();
  if (logo) attachments.push(logo);

  const formattedHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0c10; color: #e5e5e5; margin: 0; padding: 20px; }
        .container { max-width: 650px; margin: 0 auto; background: #16181d; border: 1px solid #c5a059; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { background: #121319; padding: 25px 20px; border-bottom: 2px solid #c5a059; text-align: center; }
        .header img { height: 65px; max-width: 180px; width: auto; display: block; margin: 0 auto 10px auto; }
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
          ${logo ? `<img src="cid:ipmexim-logo" alt="IPM Exim Official Logo" />` : `<img src="https://ipmexim-import-export-frontend.vercel.app/logo.png" alt="IPM Exim Logo" />`}
          <h1>IPM Exim</h1>
          <p>Direct Commercial Channel &bull; Global Export Sourcing</p>
        </div>
        <div class="content">
          <div class="message-body">${message}</div>
          <p style="margin-top: 25px; font-size: 14px; color: #9da3af;">
            Warm regards,<br/>
            <strong style="color: #ffffff;">${adminName || 'Commercial Trade Desk'}</strong><br/>
            <span style="color: #c5a059;">IPM Exim Global</span><br/>
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
    from: EMAIL_FROM,
    to,
    replyTo: NOTIFICATION_EMAIL,
    subject: subject || 'Response regarding your IPM Exim Sourcing Enquiry',
    text: message,
    html: formattedHtml,
    attachments,
  });
};
