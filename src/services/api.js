import bcrypt from 'bcryptjs-react';
import { generateToken } from '../utils/jwt';
import database from './db';

const api = {
  post: async (url, data) => {
    if (url === '/auth/register') {
      const existingUser = database.getUserByEmail(data.email);
      if (existingUser) {
        throw new Error('Email já cadastrado');
      }
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const newUser = await database.insertUser({ ...data, password: hashedPassword });
      const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });//Token also store the user role
      return { data: { user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role }, token } };
    }

    if (url === '/auth/login') {
      const user = database.getUserByEmail(data.email);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      const passwordMatch = await bcrypt.compare(data.password, user.password);
      if (!passwordMatch) {
        throw new Error('Credenciais inválidas');
      }
      const token = generateToken({ id: user.id, email: user.email, role: user.role });//Token also store the user role
      return { data: { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token } };
    }

    if (url === '/gyms') {
      const user = await database.getUserById(data?.userId)
      if (!user || user?.role !== 'admin') {
        throw new Error('Usuário não é administrador.');
      }
      const newGym = await database.insertGym(data)
      return { data: newGym };
    }
    if (url === '/check-ins') {
      const today = new Date().toISOString().split('T')[0];
      const existingCheckIn = database.getCheckInsByUserId(data.userId)
        .find(checkIn => new Date(checkIn.date).toISOString().startsWith(today));
      if (existingCheckIn) {
        throw new Error('Você já fez check-in hoje.');
      }
      const newCheckIn = await database.insertCheckIn({
        ...data,
        date: new Date().toISOString()
      });
      return { data: newCheckIn };
    }

    if (url === '/users/role') { // Endpoint to update users roles, need isAdmin check and userId for set target user
      const userAdmin = await database.getUserById(data?.adminUserId);
      if (!userAdmin || userAdmin?.role !== 'admin') {
        throw new Error('Você não possui privilégios para realizar esta ação.')
      }
      const updatedUser = await database.updateUserRole(data?.targetUserId, data?.role);
      return { data: updatedUser };
    }

    throw new Error('Endpoint não encontrado.');
  },
  get: async (url, params) => {
    if (url === '/me') {
      const user = await database.getUserById(params?.userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      return { data: user };
    }
    if (url === '/gyms') {
      const page = params?.page || 1;
      const query = params?.query;
      let gyms = database.getGyms()
      if (query) {
        gyms = gyms.filter(gym => gym.name.toLowerCase().includes(query.toLowerCase()));
      }

      const startIndex = (page - 1) * 20;
      const endIndex = page * 20;
      const paginatedGyms = gyms.slice(startIndex, endIndex);
      return {
        data: {
          gyms: paginatedGyms,
          totalPages: Math.ceil(gyms.length / 20),
          currentPage: page
        }
      };
    }
    if (url.startsWith('/gyms/')) { // conditional for dinamic id access at "/gyms" root (  using "/gyms/" as condition avoid conflit for request gyms route as well.)
      const id = parseInt(url.split('/')[2])
      const gym = await database.getGymById(id);

      return { data: gym }; // refactoring  get item by id , now its one obj directly.
    }
    if (url === '/check-ins') {
      const checkIns = database.getCheckInsByUserId(params?.userId);
      return { data: checkIns };
    }
    throw new Error('Endpoint não encontrado.');
  }
};

export default api;