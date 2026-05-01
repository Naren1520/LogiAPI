// Config-driven status engine dictating valid transitions
const VALID_TRANSITIONS = {
    'created': ['picked-up'],
    'picked-up': ['in-transit'],
    'in-transit': ['out-for-delivery'],
    'out-for-delivery': ['delivered', 'failed'],
    'delivered': [],
    'failed': ['out-for-delivery']
};

const isValidTransition = (currentStatus, newStatus) => {
    return VALID_TRANSITIONS[currentStatus]?.includes(newStatus);
};

module.exports = { VALID_TRANSITIONS, isValidTransition };
