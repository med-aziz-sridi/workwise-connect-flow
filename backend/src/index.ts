
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import jobRoutes from './routes/jobs';
import userRoutes from './routes/users';
import applicationRoutes from './routes/applications';
import projectRoutes from './routes/projects';
import notificationRoutes from './routes/notifications';
import authRoutes from './routes/auth';
import experienceRoutes from './routes/experiences';
import certificationRoutes from './routes/certifications';

// Load environment variables
dotenv.config();

// Create Express server
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/certifications', certificationRoutes);

// Root route for health check
app.get('/', (req, res) => {
  res.send('Freeness API is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
