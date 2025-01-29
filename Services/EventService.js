const { insertEvent, deleteEvent, updateEvent, getByUserId, getById , getAll, EventOverlap} = require("../utils/queries/eventQueries");
const db=require('../config/db');

const createEvent=async(start_date,end_date,title,guests,description,priority,is_personal,user_id)=>{
    return new Promise((resolve,reject)=>{

        db.query(EventOverlap,[user_id, start_date, start_date, start_date, end_date, start_date, end_date],(err,results)=>{
            if (err) return reject(err);
            if (results.length > 0) {
                return resolve(null);
            }
            const eventData={start_date,end_date,title,guests:JSON.stringify(guests),description,priority,is_personal,user_id};
            db.query(insertEvent,eventData,(err,result)=>{
                if (err) return reject(err);
                resolve(result);
            });
        });  
    });
};


const getEventByIdService = async (eventId) => {
    return new Promise((resolve, reject) => {
        db.query(getById, [eventId], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject(new Error('Event not found'));
            resolve(results);
        });
    });
};

const getEventByUserId=async(userId)=>{
    return new Promise((resolve, reject) => {

        db.query(getByUserId, [userId], (err, results) => {
            if (err) return reject(err);
            
            if (results.length === 0) return reject(new Error('Event not found'));
            
            resolve(results);
        });
    });
}


const updateEventService = async (eventId,body) => {
    
    return new Promise((resolve, reject) => {
        const updatedData = { start_date, end_date, title, guests: JSON.stringify(guests), description, priority, is_personal };
        
        db.query(updateEvent, [updatedData, eventId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};


const deleteEventService = async (eventId) => {
    return new Promise((resolve, reject) => {
        db.query(deleteEvent, [eventId], (err, result) => {
            if (err) return reject(err);
            if (result.affectedRows === 0) {
                return reject(new Error('Event not found')); 
            }
            resolve(result);
        });
    });
};

const checkEventExists = async (eventId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM events WHERE id = ?', [eventId], (err, results) => {
            if (err) return reject(err); 
            if (results.length === 0) return resolve(null);
            resolve(results[0]);
        });
    });
};


// Admin
const getAllEvents=async()=>{
    return new Promise((resolve,reject)=>{
        db.query(getAll,(err,results)=>{
            if(err) return reject(err);
            resolve(results);
        })
    })
}

module.exports={getAllEvents,checkEventExists,createEvent,deleteEventService,updateEventService,getEventByIdService,getEventByUserId};