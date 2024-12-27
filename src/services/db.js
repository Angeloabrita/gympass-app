import alasql from 'alasql';
import bcrypt from 'bcryptjs-react';

// eslint-disable-next-line no-multi-str
alasql('CREATE LOCALSTORAGE DATABASE IF NOT EXISTS gymdb;\
    ATTACH LOCALSTORAGE DATABASE gymdb; \
    USE gymdb; \
    ', [], function () {
  //created user
  alasql.promise('CREATE TABLE IF NOT EXISTS users (id INT, name STRING, email STRING, password STRING, role STRING)')
  //created gym
  alasql.promise('CREATE TABLE IF NOT EXISTS gyms (id INT, name STRING, description STRING, phone STRING, latitude FLOAT, longitude FLOAT)')
  //create check_in
  alasql.promise('CREATE TABLE IF NOT EXISTS check_ins (id INT, userId INT, gymId INT, date DATETIME)');
});
alasql.options.errorlog = true;

// Initialize the gyms table (opcional)
if (alasql('SELECT * FROM gyms').length === 0) {
  alasql("INSERT INTO gyms VALUES(1, 'Academia Alpha', 'Ótima academia para treinos avançados', '52999068801', -23.550520, -46.633308)"); // São Paulo
  alasql("INSERT INTO gyms VALUES(2, 'Academia Beta', 'Academia com foco em musculação', '52999068802', -22.906847, -43.172897)"); // Rio de Janeiro
  alasql("INSERT INTO gyms VALUES(3, 'Academia Gamma', 'Treinamento funcional e musculação', '52999068803', -19.924502, -43.935238)"); // Belo Horizonte
  alasql("INSERT INTO gyms VALUES(4, 'Academia Delta', 'Ótima para iniciantes', '52999068804', -12.971399, -38.501392)"); // Salvador
  alasql("INSERT INTO gyms VALUES(5, 'Academia Epsilon', 'Equipamentos de alta qualidade', '52999068805', -8.047562, -34.877001)"); // Recife
  alasql("INSERT INTO gyms VALUES(6, 'Academia Zeta', 'Excelência em treinos aeróbicos', '52999068806', -3.119028, -60.021731)"); // Manaus
  alasql("INSERT INTO gyms VALUES(7, 'Academia Eta', 'CrossFit e funcional', '52999068807', -30.034647, -51.217659)"); // Porto Alegre
  alasql("INSERT INTO gyms VALUES(8, 'Academia Theta', 'Especializada em pilates', '52999068808', -25.428954, -49.267137)"); // Curitiba
  alasql("INSERT INTO gyms VALUES(9, 'Academia Iota', 'Academia para toda a família', '52999068809', -15.794229, -47.882166)"); // Brasília
  alasql("INSERT INTO gyms VALUES(10, 'Academia Kappa', 'Alta tecnologia nos treinos', '52999068810', -16.686882, -49.264788)"); // Goiânia
  alasql("INSERT INTO gyms VALUES(11, 'Academia Lambda', 'Treinos personalizados', '52999068811', -2.530735, -44.306778)"); // São Luís
  alasql("INSERT INTO gyms VALUES(12, 'Academia Mu', 'Foco em treinos de resistência', '52999068812', -10.947246, -37.073082)"); // Aracaju
  alasql("INSERT INTO gyms VALUES(13, 'Academia Nu', 'Musculação e cardio', '52999068813', -7.115032, -34.863121)"); // João Pessoa
  alasql("INSERT INTO gyms VALUES(14, 'Academia Xi', 'Treinos em grupo e individuais', '52999068814', -9.648183, -35.708949)"); // Maceió
  alasql("INSERT INTO gyms VALUES(15, 'Academia Omicron', 'Foco em emagrecimento', '52999068815', -18.918612, -48.275482)"); // Uberlândia
  alasql("INSERT INTO gyms VALUES(16, 'Academia Pi', 'Academia 24 horas', '52999068816', -20.315503, -40.312778)"); // Vitória
  alasql("INSERT INTO gyms VALUES(17, 'Academia Rho', 'Treinos para idosos e jovens', '52999068817', -1.455754, -48.490179)"); // Belém
  alasql("INSERT INTO gyms VALUES(18, 'Academia Sigma', 'Academia com acompanhamento nutricional', '52999068818', -4.970629, -39.016406)"); // Sobral
  alasql("INSERT INTO gyms VALUES(19, 'Academia Tau', 'Espaço amplo e moderno', '52999068819', -22.328669, -49.068582)"); // Bauru
  alasql("INSERT INTO gyms VALUES(20, 'Academia Upsilon', 'Aulas de dança e zumba', '52999068820', -21.170400, -47.810324)"); // Ribeirão Preto
  alasql("INSERT INTO gyms VALUES(21, 'Academia Phi', 'Especializada em treino funcional', '52999068821', -22.906847, -43.209373)"); // Niterói
  alasql("INSERT INTO gyms VALUES(22, 'Academia Chi', 'Treinamento de alta performance', '52999068822', -23.967730, -46.392357)"); // Santos
  alasql("INSERT INTO gyms VALUES(23, 'Academia Psi', 'Academia para atletas', '52999068823', -27.595378, -48.548050)"); // Florianópolis
  alasql("INSERT INTO gyms VALUES(24, 'Academia Omega', 'Ótima opção para fitness', '52999068824', -20.464718, -54.616785)"); // Campo Grande
  alasql("INSERT INTO gyms VALUES(25, 'Academia Eros', 'Treinos para todas as idades', '52999068825', -3.717220, -38.543400)"); // Fortaleza
  alasql("INSERT INTO gyms VALUES(26, 'Academia Hera', 'Aulas de yoga e pilates', '52999068826', -29.718290, -52.425637)"); // Santa Cruz do Sul
  alasql("INSERT INTO gyms VALUES(27, 'Academia Zeus', 'Especializada em fisiculturismo', '52999068827', -18.591779, -46.514545)"); // Patos de Minas
  alasql("INSERT INTO gyms VALUES(28, 'Academia Ares', 'Crossfit e treinos de força', '52999068828', -22.743100, -47.335205)"); // Limeira
  alasql("INSERT INTO gyms VALUES(29, 'Academia Atena', 'Treinamento feminino', '52999068829', -5.794480, -35.211010)"); // Natal
  alasql("INSERT INTO gyms VALUES(30, 'Academia Apolo', 'Ótima infraestrutura e equipamentos modernos', '52999068830', -8.056700, -34.951000)"); // Olinda
}

// Criate default admin
if (alasql('SELECT * FROM users WHERE role = "admin"').length === 0) {
  const lastId = alasql('SELECT MAX(id) as maxId FROM users')[0].maxId || 0;
  const newId = lastId + 1
  const hashedPassword = await bcrypt.hash('admin123', 10);
  alasql('INSERT INTO users VALUES(?, ?, ?, ?, ?)', [newId, 'Admin User', 'admin@gympass.com', hashedPassword, 'admin']);
}

//simulate database model and data in localstorage
const database = {
  insertUser: (userData) => {
    const lastId = alasql('SELECT MAX(id) as maxId FROM users')[0].maxId || 0;
    const newId = lastId + 1
    alasql('INSERT INTO users VALUES(?, ?, ?, ?, ?)', [newId, userData.name, userData.email, userData.password, 'user']);// User is default role
    return { id: newId, ...userData, role: 'user' }
  },
  getUserByEmail: (email) => {
    return alasql('SELECT * FROM users WHERE email = ?', [email])[0];
  },
  getUserById: (id) => {
    return alasql('SELECT id, name, email, role FROM users WHERE id = ?', [id])[0]; //Return user's role
  },
  updateUserRole: (userId, role) => {
    alasql('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
    return alasql('SELECT id, name, email, role FROM users WHERE id = ?', [userId])[0]
  },
  insertGym: (gymData) => {
    const lastId = alasql('SELECT MAX(id) as maxId FROM gyms')[0].maxId || 0;
    const newGymId = lastId + 1;
    alasql('INSERT INTO gyms VALUES(?, ?, ?, ?, ?, ?)', [newGymId, gymData.name, gymData.description, gymData.phone, gymData.latitude, gymData.longitude]);
    return { id: newGymId, ...gymData };
  },
  getGyms: () => alasql('SELECT * FROM gyms'),
  getGymById: (id) => { // refact to handle response with single object with ids  for database logic using array method, the method dont do it anymore and return one object instead array like list methods do it in this lib
    const res = alasql('SELECT * FROM gyms WHERE id = ?', [id]);
    return res && Array.isArray(res) && res?.length > 0 ? res[0] : null // handling id list to object case (for unique item)  and  handling database error case by using or null

  }, insertCheckIn: (checkInData) => {
    const lastId = alasql('SELECT MAX(id) as maxId FROM check_ins')[0].maxId || 0;
    const newCheckInId = lastId + 1;
    alasql('INSERT INTO check_ins VALUES(?, ?, ?, ?)', [newCheckInId, checkInData.userId, checkInData.gymId, checkInData.date]);
    return { id: newCheckInId, ...checkInData };
  },
  getCheckInsByUserId: (userId) => alasql('SELECT * FROM check_ins WHERE userId = ?', [userId]),
};
export default database;