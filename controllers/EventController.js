const { createEvent, updateEventService, deleteEventService, getEventByUserId, checkEventExists, getAllEvents } = require("../Services/EventService");

const createEventController = async (req, res) => {
    const { start_date, end_date, title, guests, description, priority, is_personal} = req.body;
    const userId=req.userId;   
    
    try {
        const result = await createEvent(start_date, end_date, title, guests, description, priority, is_personal, userId);
        
        if (!result){
            return res.status(409).json({ message: "You already have an event scheduled during this time" });
        }
        res.status(201).json({ message: 'Event created successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateEventController = async (req, res) => {
    const { eventId } = req.params;    
    try {
        const event=await checkEventExists(eventId);

        if(!event) return res.status(404).json({message:'Event not found'});

        await updateEventService(eventId, req.body);
        
        res.status(200).json({ message: 'Event updated successfully'});
    } catch (error) {        
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteEventController = async (req, res) => {
    const { eventId } = req.params;
    
    try {
        const event=await checkEventExists(eventId);
         
        if(!event){
            return res.status(404).json({message:'Event not found'});
        }

        const result = await deleteEventService(eventId);
        res.status(200).json({ message: 'Event deleted successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getEventByUserIDController = async (req, res) => {
    const userId = req.userId;   
        
    try {
        const event = await getEventByUserId(userId);
        res.status(200).json({ event });
    } catch (error) {
    
        if (error.message === 'Event not found') {
            return res.status(400).json({ message: "No events registered by this user"});
        }
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllEventsController=async(req,res)=>{
    try{
        const events = await getAllEvents();
        res.status(200).json({ events });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}
module.exports={getAllEventsController,getEventByUserIDController,deleteEventController,updateEventController,createEventController}
