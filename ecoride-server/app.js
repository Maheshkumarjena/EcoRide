import dotenv from 'dotenv'
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectToDb from './db/db.js';
import userRoutes from './routes/user.routes.js';
import rideRoutes from './routes/ride.routes.js';
// import rideRoutes from './routes/ride.routes.js';
import mapRoutes from './routes/map.routes.js';
import bookingRoutes from './routes/booking.routes.js';

dotenv.config();

const app = express();
connectToDb();

const FRONTEND_DOMAIN=process.env.NEXT_FRONTEND_URL || "https://eco-ride-virid.vercel.app";
console.log("FRONTEND_DOMAIN",FRONTEND_DOMAIN);
const allowedOrigins = ["http://localhost:3000", "https://eco-ride-virid.vercel.app"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

  app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/users', userRoutes);
app.use('/rides', rideRoutes);
app.use('/maps', mapRoutes);
app.use('/bookings', bookingRoutes);



export default app;
