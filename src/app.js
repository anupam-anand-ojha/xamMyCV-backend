import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import testRoute from './routes/testRoutes.js';


const app = express();

app.use(cors());

app.use(express.json);
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes)
app.use('/api/test', testRoute)

app.get('/', (req, res) => {

  res.send('XamMyCV API is running');
});

export default app