import express from 'express';
import mongoose from 'mongoose';
import router from './routes/user-routes';

const app = express();
const port = 4000;

app.use(express.json());
app.use("/api/user",router);

mongoose.connect("mongodb+srv://pratyushjindal2003:samplePasswordSocialMedia@cluster0.apnopgm.mongodb.net/Socialmedia?retryWrites=true&w=majority")
.then(() => app.listen(port))    
.then(() =>
        console.log('Connected to database!')
    )
.catch((err) => console.log(err))
