const express= require('express');
const app=express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoutes=require('./routes/userRoutes');
const EventRoutes=require('./routes/EventRoutes');

dotenv.config();
app.use(bodyParser.json());

app.use('/api/users',userRoutes);
app.use('/api/events',EventRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
    
})