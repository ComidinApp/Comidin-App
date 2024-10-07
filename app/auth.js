import { Auth, Amplify } from 'aws-amplify'; 
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

// Función de inicio de sesión
async function signIn(username, password) {
  try {
    console.log(Auth, ' ######## ')
    const user = await Auth.signIn(username, password);
    console.log('Usuario autenticado:', user);
    return user;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
}

// Función para obtener el token JWT
async function getCurrentSession() {
  try {
    const session = await Auth.currentSession();
    return session.getIdToken().getJwtToken();
  } catch (error) {
    console.error('Error al obtener la sesión:', error);
    throw error;
  }
}

export { signIn, getCurrentSession };