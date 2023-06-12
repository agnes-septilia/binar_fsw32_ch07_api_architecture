var express = require('express');
var router = express.Router();

// import Auth Check
const { adminAuthCheck } = require('../lib/AdminAuthCheck')
const { userAuthCheck } = require('../lib/UserAuthCheck')

// import controller 
const { landingPageController } = require('../controllers/landingPageController')
const { signupPageController } = require('../controllers/signupPageController')
const { loginPageController } = require('../controllers/loginPageController')
const { userProfilePageController } = require('../controllers/userProfilePageController')
const { gameEntrancePageController } = require('../controllers/gamePageControllers/gameEntrancePageController') 
const { gameRoomPageController } = require('../controllers/gamePageControllers/gameRoomPageController')
const { gamePlayPageController } = require('../controllers/gamePageControllers/gamePlayPageController')
const { adminPageController } = require('../controllers/adminPageController')
const { logoutController } = require('../controllers/logoutController')



// Landing Page 
router.get('/', landingPageController.showLandingPage)

// Sign Up Pages
router.get('/signup', signupPageController.showSignUpPage)
router.post('/signupValidation', signupPageController.runSignupValidation)

// Log In and Pages
router.get('/login', loginPageController.showLoginPage)
router.post('/loginValidation', loginPageController.runLoginValidation)

// Update Profile Pages
router.get('/profile', userAuthCheck, userProfilePageController.showProfilePage)
router.get('/updateProfile', userAuthCheck, userProfilePageController.showEditProfilePage)
router.post('/profile', userProfilePageController.updatedProfilePage)

// Room and Games Pages
router.get('/gameEntrance', gameEntrancePageController.showGameEntrancePage)  // this to show entrance area
router.post('/room', gameRoomPageController.loadGameRoomPage)  // this to load the match and enter the game for the first round 
router.post('/gameResult', gamePlayPageController.showGameResult)  // this to show game result
router.post('/game',  gamePlayPageController.nextRoundGame)  // this to show game for the 2nd and 3rd round

// Superadmin pages
router.get('/admin', adminAuthCheck, adminPageController.validateAdmin)
router.post('/admin', adminPageController.showAdminPage)

// Log Out Page
router.post('/logout', logoutController.logoutConfirmation)

module.exports = router;
