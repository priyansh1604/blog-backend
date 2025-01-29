module.exports = {
    insertEvent:'INSERT INTO events SET ?',
    deleteEvent:'DELETE FROM events WHERE id = ?',
    updateEvent:'UPDATE events SET ? WHERE id = ?',
    getByUserId:'SELECT * FROM events WHERE user_id = ?',
    getById:'SELECT * FROM events WHERE id = ?',
    getAll:'SELECT * FROM events',
    EventOverlap:'SELECT * FROM events WHERE user_id=? AND ( (start_date <= ? AND end_date >= ?) OR (start_date >= ? AND start_date <= ?) OR ((end_date >= ? AND end_date <= ?)) )'
};
