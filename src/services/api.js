import axios from 'axios';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

// Simulação de um banco de dados (poderia ser uma API real)
let users = [];
let gyms = [
    { id: 1, name: 'Academia X', description: 'Ótima academia', phone: '1111111', latitude: 10, longitude: 10 },
    { id: 2, name: 'Academia Y', description: 'Academia bacana', phone: '2222222', latitude: 20, longitude: 20 }
];
let checkIns = [];
let lastGymId = 2;


const api = {
    post: async (url, data) => {
        if (url === '/auth/register') {
            const existingUser = users.find(user => user.email === data.email);
            if (existingUser) {
                throw new Error('Email já cadastrado');
            }
             const hashedPassword = await bcrypt.hash(data.password, 10);
             const newUser = { id: users.length + 1, ...data, password: hashedPassword };
            users.push(newUser);
            const token = generateToken({ id: newUser.id, email: newUser.email });
             return { data: { user: { id: newUser.id, email: newUser.email, name: newUser.name }, token } };
        }

        if (url === '/auth/login') {
            const user = users.find(user => user.email === data.email);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            const passwordMatch = await bcrypt.compare(data.password, user.password);
            if (!passwordMatch) {
                throw new Error('Credenciais inválidas');
            }
            const token = generateToken({ id: user.id, email: user.email });
            return { data: { user: { id: user.id, email: user.email, name: user.name }, token } };
        }

        if (url === '/gyms') {
          if(!data?.isAdmin) {
            throw new Error('Usuário não é administrador.')
          }
            lastGymId++;
            const newGym = { id: lastGymId, ...data };
            gyms.push(newGym);
            return { data: newGym };
        }


        if(url === '/check-ins') {
            const today = new Date().toISOString().split('T')[0];
             const existingCheckIn = checkIns.find(
              (checkIn) => checkIn.userId === data.userId && checkIn.date.startsWith(today)
             );
            if(existingCheckIn) {
                throw new Error('Você já fez check-in hoje.');
            }
             const newCheckIn = {
              id: checkIns.length + 1,
              userId: data.userId,
              gymId: data.gymId,
              date: new Date().toISOString()
             };
            checkIns.push(newCheckIn);
            return { data: newCheckIn };
        }

        throw new Error('Endpoint não encontrado.');
    },
    get: async (url, params) => {
        if (url === '/me') {
            const userId = params?.userId;
            const user = users.find(user => user.id === userId);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            return { data: { id: user.id, email: user.email, name: user.name } };
        }

        if (url === '/gyms') {
            const page = params?.page || 1;
            const query = params?.query;
            let filteredGyms = gyms;

            if(query) {
                filteredGyms = gyms.filter(gym => gym.name.toLowerCase().includes(query.toLowerCase()))
            }

            const startIndex = (page - 1) * 20;
            const endIndex = page * 20;
            const paginatedGyms = filteredGyms.slice(startIndex, endIndex);

            return {
                data: {
                    gyms: paginatedGyms,
                    totalPages: Math.ceil(filteredGyms.length / 20),
                    currentPage: page,
                }
            }

        }

        if(url === '/check-ins') {
           const userId = params?.userId;
             const filteredCheckIns = checkIns.filter(checkIn => checkIn.userId === userId);
             return { data: filteredCheckIns };
        }

        throw new Error('Endpoint não encontrado.');
    }
};

export default api;