import bcrypt from 'bcryptjs-react';
import { generateToken } from '../utils/jwt';
import database from './db';

// Defining the API
const api = {
  // POST method
  post: async (url, data) => {
    // User registration
    if (url === '/auth/register') {
      // Checking if email is already registered
      const existingUser = database.getUserByEmail(data.email);
      if (existingUser) {
        throw new Error('Email already registered');
      }
      // Hashing password
      const hashedPassword = await bcrypt.hash(data.password, 10);
      // Creating new user
      const newUser = await database.insertUser({ ...data, password: hashedPassword });
      // Generating authentication token
      const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });
      // Returning user and token
      return { data: { user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role }, token } };
    }

    // User login
    if (url === '/auth/login') {
      // Checking if user exists
      const user = database.getUserByEmail(data.email);
      if (!user) {
        throw new Error('User not found');
      }
      // Checking password
      const passwordMatch = await bcrypt.compare(data.password, user.password);
      if (!passwordMatch) {
        throw new Error('Invalid credentials');
      }
      // Generating authentication token
      const token = generateToken({ id: user.id, email: user.email, role: user.role });
      // Returning user and token
      return { data: { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token } };
    }

    // Creating gym
    if (url === '/gyms') {
      // Checking if user is admin
      const user = await database.getUserById(data?.userId);
      if (!user || user?.role !== 'admin') {
        throw new Error('User is not an administrator');
      }
      // Creating gym
      const newGym = await database.insertGym(data);
      // Returning created gym
      return { data: newGym };
    }

    // User check-in
    if (url === '/check-ins') {
      // Checking if user has already checked-in today
      const today = new Date().toISOString().split('T')[0];
      const existingCheckIn = database.getCheckInsByUserId(data.userId)
        .find(checkIn => new Date(checkIn.date).toISOString().startsWith(today));
      if (existingCheckIn) {
        throw new Error('You have already checked-in today');
      }
      // Creating check-in
      const newCheckIn = await database.insertCheckIn({
        ...data,
        date: new Date().toISOString()
      });
      // Returning created check-in
      return { data: newCheckIn };
    }

    // Updating user role
    if (url === '/users/role') {
      // Checking if user is admin
      const userAdmin = await database.getUserById(data?.adminUserId);
      if (!userAdmin || userAdmin?.role !== 'admin') {
        throw new Error('You do not have permission to perform this action');
      }
      // Updating user role
      const updatedUser = await database.updateUserRole(data?.targetUserId, data?.role);
      // Returning updated user
      return { data: updatedUser };
    }

    // Endpoint not found
    throw new Error('Endpoint not found');
  },

  // GET method
  get: async (url, params) => {
    // User information
    if (url === '/me') {
      // Checking if user exists
      const user = await database.getUserById(params?.userId);
      if (!user) {
        throw new Error('User not found');
      }
      // Returning user
      return { data: user };
    }

    // Gym list
    if (url === '/gyms') {
      // Pagination
      const page = params?.page || 1;
      const query = params?.query;
      let gyms = database.getGyms();
      // Filtering by name
      if (query) {
        gyms = gyms.filter(gym => gym.name.toLowerCase().includes(query.toLowerCase()));
      }

      // Pagination
      const startIndex = (page - 1) * 20;
      const endIndex = page * 20;
      const paginatedGyms = gyms.slice(startIndex, endIndex);
      // Returning gym list
      return {
        data: {
          gyms: paginatedGyms,
          totalPages: Math.ceil(gyms.length / 20),
          currentPage: page
        }
      };
    }

    // Gym information
    if (url.startsWith('/gyms/')) {
      // Extracting gym ID
      const id = parseInt(url.split('/')[2]);
      // Getting gym
      const gym = await database.getGymById(id);
      // Returning gym
      return { data: gym };
    }

    // User check-ins
    if (url === '/check-ins') {
      // Getting user check-ins
      const checkIns = database.getCheckInsByUserId(params?.userId);
      // Returning check-ins
      return { data: checkIns };
    }

    // Endpoint not found
    throw new Error('Endpoint not found');
  }
};

// Exporting API
export default api;