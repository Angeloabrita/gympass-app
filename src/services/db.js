import alasql from 'alasql';
import bcrypt from 'bcryptjs-react';

// eslint-disable-next-line no-multi-str
alasql('CREATE LOCALSTORAGE DATABASE IF NOT EXISTS gymdb;\
    ATTACH LOCALSTORAGE DATABASE gymdb; \
    USE gymdb; \
    ', [], function(){
    //created user
    alasql.promise('CREATE TABLE IF NOT EXISTS users (id INT, name STRING, email STRING, password STRING, role STRING)')
    //created gym
    alasql.promise('CREATE TABLE IF NOT EXISTS gyms (id INT, name STRING, description STRING, phone STRING, latitude FLOAT, longitude FLOAT)')
    //create check_in
    alasql.promise('CREATE TABLE IF NOT EXISTS check_ins (id INT, userId INT, gymId INT, date DATETIME)');  
});
alasql.options.errorlog = true;
// Inicialização do banco de dados AlaSQL
// alasql('CREATE TABLE users (id INT, name STRING, email STRING, password STRING)');
// alasql('CREATE TABLE gyms (id INT, name STRING, description STRING, phone STRING, latitude FLOAT, longitude FLOAT)');
// alasql('CREATE TABLE check_ins (id INT, userId INT, gymId INT, date DATETIME)');

// Inicialização das Academias (opcional)
if(alasql('SELECT * FROM gyms').length === 0) {
    alasql("INSERT INTO gyms VALUES(1, 'Academia X', 'Ótima academia', '1111111', 10, 10)");
    alasql("INSERT INTO gyms VALUES(2, 'Academia Y', 'Academia bacana', '2222222', 20, 20)");
}

// Criar um usuario admin padrao, caso nao tenha nenhum usuario
if (alasql('SELECT * FROM users WHERE role = "admin"').length === 0) {
    const lastId = alasql('SELECT MAX(id) as maxId FROM users')[0].maxId || 0;
    const newId =  lastId + 1
    const hashedPassword = await bcrypt.hash('admin123', 10);
      alasql('INSERT INTO users VALUES(?, ?, ?, ?, ?)', [newId, 'Admin User', 'admin@gympass.com', hashedPassword, 'admin']);
}


const db = {
    insertUser: (userData) => {
        const lastId = alasql('SELECT MAX(id) as maxId FROM users')[0].maxId || 0;
      const newId = lastId+ 1
       alasql('INSERT INTO users VALUES(?, ?, ?, ?, ?)', [newId, userData.name, userData.email, userData.password, 'user']);// User is default role
     return { id: newId, ...userData , role: 'user'}
   },
    getUserByEmail: (email) => {
     return alasql('SELECT * FROM users WHERE email = ?', [email])[0];
   },
   getUserById: (id) => {
      return alasql('SELECT id, name, email, role FROM users WHERE id = ?', [id])[0]; //Return user's role
    },
  updateUserRole: (userId, role) => {
    alasql('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
     return  alasql('SELECT id, name, email, role FROM users WHERE id = ?', [userId])[0]
      },
    insertGym: (gymData) => {
     const lastId = alasql('SELECT MAX(id) as maxId FROM gyms')[0].maxId || 0;
        const newGymId =  lastId+ 1;
     alasql('INSERT INTO gyms VALUES(?, ?, ?, ?, ?, ?)', [newGymId, gymData.name, gymData.description, gymData.phone, gymData.latitude, gymData.longitude]);
          return {id: newGymId, ...gymData };
   },
   getGyms: () => alasql('SELECT * FROM gyms'),
   getGymById: (id) =>  alasql('SELECT * FROM gyms WHERE id = ?', [id])[0],
    insertCheckIn: (checkInData) => {
        const lastId = alasql('SELECT MAX(id) as maxId FROM check_ins')[0].maxId || 0;
       const newCheckInId =  lastId+ 1;
        alasql('INSERT INTO check_ins VALUES(?, ?, ?, ?)', [newCheckInId, checkInData.userId, checkInData.gymId, checkInData.date]);
         return {id: newCheckInId, ...checkInData};
     },
     getCheckInsByUserId: (userId) => alasql('SELECT * FROM check_ins WHERE userId = ?', [userId]),
   };
   export default db;