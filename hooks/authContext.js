import { createContext, useMemo } from 'react';
import { signIn, signOut, getCurrentSession } from '../context/AuthContext.js';

const AuthContext = createContext();

const authContext = useMemo(() => ({
  signIn: async (username, password) => {
    const token = await signIn(username, password);
    return token;
  },
  signOut: async () => {
    await signOut();
  },
  getCurrentSession: async () => {
    return await getCurrentSession();
  },
}), []);

export { AuthContext, authContext };