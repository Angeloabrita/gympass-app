import jwtDecode from 'jwt-decode';

const secretKey = 'minhaChaveSuperSecreta'; // substitua por uma variavel de ambiente 

export const generateToken = (payload) => {
    //Simples assinatura com um objeto literal usando secret
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
   const signature = btoa(secretKey);

return `${encodedHeader}.${encodedPayload}.${signature}`;

};

export const verifyToken = (token) => {
  try {
       //Verifica token no método decodificando a signature com o mesmo secretKey
        const [encodedHeader, encodedPayload, signature] = token.split('.');
       const decodedSignature = atob(signature);
         if (decodedSignature !== secretKey) {
        return null;
        }
        const decodedPayload = JSON.parse(atob(encodedPayload));
     return decodedPayload;
    } catch (error) {
    return null;
  }
};