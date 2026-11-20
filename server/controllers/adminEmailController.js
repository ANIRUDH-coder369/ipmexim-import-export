const Quotation = require('../models/Quotation');
const { sendEmailToCustomer } = require('../services/emailService');

// @desc    Admin sends email to customer (auto-picks customer email from quotation, or takes custom admin customer email input)
// @route   POST /admin/send-email or POST /admin/quotations/:id/send-email
// @access  Private (Admin only)
const sendCustomerEmail = async (req, res) => {
  try {
    const params = req.params || {};
    const body = req.body || {};
    const quotationId = params.id || body.quotationId;
    let targetEmail = body.customerEmail || body.toEmail || body.recipientEmail || body.email;
    const { subject, message, updateStatus, html } = body;

    if (!subject || (!message && !html)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both an email subject and a message body.'
      });
    }

    let quotation = null;
    if (quotationId) {
      quotation = await Quotation.findById(quotationId);
      // If admin didn't manually type the customer email, use the one submitted by customer
      if (!targetEmail && quotation) {
        targetEmail = quotation.corporateEmail || quotation.email;
      }
    }

    if (!targetEmail) {
      return res.status(400).json({
        success: false,
        message: 'Customer email is required. Please provide customerEmail or toEmail.'
      });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(targetEmail.toLowerCase().trim())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid customer email address format provided.'
      });
    }

    const adminName = req.admin?.name || 'Trade Desk Administrator';

    // Send the email via emailService
    const result = await sendEmailToCustomer({
      to: targetEmail.toLowerCase().trim(),
      subject,
      message,
      html,
      adminName,
      quotationId: quotation?._id
    });

    // If linked to a quotation, log to emailHistory and update status
    if (quotation) {
      if (!quotation.emailHistory) {
        quotation.emailHistory = [];
      }
      quotation.emailHistory.push({
        sentAt: new Date(),
        sentBy: req.admin?.email || adminName,
        toEmail: targetEmail.toLowerCase().trim(),
        subject,
        message: message || '(HTML Email)',
        status: 'sent'
      });

      // Update quotation status if specified or advance to 'contacted'
      if (updateStatus && ['contacted', 'quoted', 'in_review', 'closed'].includes(updateStatus)) {
        quotation.status = updateStatus;
      } else if (quotation.status === 'new') {
        quotation.status = 'contacted';
      }

      await quotation.save();
    }

    res.status(200).json({
      success: true,
      message: `Email successfully sent to customer (${targetEmail})`,
      messageId: result.messageId,
      recipient: targetEmail,
      quotationId: quotation?._id,
      updatedStatus: quotation?.status
    });
  } catch (error) {
    console.error('Error in sendCustomerEmail:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email to customer',
      error: error.message
    });
  }
};

module.exports = {
  sendCustomerEmail
};
