import jwtDecode from 'jwt-decode';

const secretKey = 'minhaChaveSuperSecreta'; // replace with your own secret key at .env
export const generateToken = (payload) => {
  //generate token
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa(secretKey);

  return `${encodedHeader}.${encodedPayload}.${signature}`;

};

export const verifyToken = (token) => {
  try {
    //Verify token in the method by decoding the signature with the same secretKey
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