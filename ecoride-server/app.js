import dotenv from 'dotenv'
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectToDb from './db/db.js';
import userRoutes from './routes/user.routes.js';
import rideRoutes from './routes/ride.routes.js';
// import rideRoutes from './routes/ride.routes.js';
import mapRoutes from './routes/map.routes.js';

dotenv.config();

const app = express();
connectToDb();

const FRONTEND_DOMAIN=process.env.NEXT_FRONTEND_URL || "https://eco-ride-virid.vercel.app";
console.log("FRONTEND_DOMAIN",FRONTEND_DOMAIN);
app.use(cors({
    origin: FRONTEND_DOMAIN,
    credentials: true
  }));
  app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/users', userRoutes);
app.use('/rides', rideRoutes);
app.use('/maps', mapRoutes);



export default app;
