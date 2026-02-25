const { requireAuth } = require('@clerk/express');

// We simply export the Clerk requireAuth middleware to be used in routes
module.exports = requireAuth({ signInUrl: '/login' });