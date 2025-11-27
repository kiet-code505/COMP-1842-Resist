const authController = require('../controllers/authController');

module.exports = function(app) {
    app.route('/api/auth/register')
        .post(authController.register);

    app.route('/api/auth/login')
        .post(authController.login);
};
