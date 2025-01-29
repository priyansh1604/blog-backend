const express = require('express');
const router = express.Router();
const eventController = require('../controllers/EventController');
const { IsAuthenticated} = require('../utils/jwtHelper');
const { isAdmin, verifyToken } = require('../middlewares/authMiddleware');

router.post('/createEvents', IsAuthenticated,eventController.createEventController);
//router.get('/events/:userId', eventController.getEventsController); 
//router.get('/getEventsById/:eventId', IsAuthenticated, eventController.getEventByIdController); 
router.put('/updateEvents/:eventId', IsAuthenticated, eventController.updateEventController); 
router.delete('/deleteEvents/:eventId', IsAuthenticated, eventController.deleteEventController);
router.get('/getEventsByUserId', IsAuthenticated, eventController.getEventByUserIDController); 

router.get('/get-all-events',verifyToken,isAdmin,eventController.getAllEventsController);

// /get-events fetch events linked to user on the basis of token


module.exports = router;
