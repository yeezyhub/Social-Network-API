const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

//Router for pages that are default
router.use((request, response) => {
  return response.send('Route route route!');
});

module.exports = router;