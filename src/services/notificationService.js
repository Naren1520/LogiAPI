const axios = require('axios');

const sendWebhook = async (url, payload) => {
    try {
        await axios.post(url, {
            event: 'shipment.updated',
            data: payload
        });
        console.log(`Webhook sent to ${url}`);
    } catch (error) {
        console.error(`Webhook failed for ${url}: ${error.message}`);
    }
};

const sendEmail = async (email, payload) => {
    // TODO: Integrate SendGrid or Nodemailer for future emails
    console.log(`[Stub] Email sent to ${email} for shipment tracking update: ${payload.trackingId}`);
};

const sendSMS = async (phone, payload) => {
    // TODO: Integrate Twilio or AWS SNS for future SMS notifications
    console.log(`[Stub] SMS sent to ${phone} for shipment tracking update: ${payload.trackingId}`);
};

const notifyUser = async (user, shipmentData) => {
    // Webhook Execution
    if (user.webhookUrl) {
        await sendWebhook(user.webhookUrl, shipmentData);
    }
    
    // Future Integrations (Uncomment when providers are configured)
    // if (user.email) await sendEmail(user.email, shipmentData);
    // if (user.phone) await sendSMS(user.phone, shipmentData);
};

module.exports = { notifyUser, sendWebhook, sendEmail, sendSMS };
