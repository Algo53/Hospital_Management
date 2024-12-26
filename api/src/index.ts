import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { ConnectToMongoDB } from './lib/db';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import userRoutes from './routes/user.routes';
import doctorRoutes from './routes/doctor.routes';
import nurseRoutes from './routes/nurse.routes';
import patientRoutes from './routes/patient.routes';

dotenv.config();
const app = express();
ConnectToMongoDB();

app.use(cors({
  origin: [process.env.CLIENT_URL || "https://hospital-management-neon.vercel.app"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/doctor', doctorRoutes);
app.use('/nurse', nurseRoutes);
app.use('/patient', patientRoutes);
app.use('/user', userRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
