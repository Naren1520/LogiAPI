const axios = require('axios');

exports.sendWebhook = async (url, payload) => {
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
