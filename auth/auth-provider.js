import React, { useState, useContext, createContext, useEffect } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { signIn, getCurrentSession } from '../app/auth'; // Importamos las funciones que creamos anteriormente

// Contexto de autenticación
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar la aplicación
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const token = await getCurrentSession();
      if (token) {
        // Si hay un token, consideramos al usuario como autenticado
        setUser({ token });
      }
    } catch (error) {
      console.error('Error al verificar la sesión:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Componente de inicio de sesión
export const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();

  const handleLogin = async () => {
    try {
      const user = await signIn(username, password);
      setUser(user);
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      // Aquí puedes manejar los errores, por ejemplo, mostrando un mensaje al usuario
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Iniciar sesión" onPress={handleLogin} />
    </View>
  );
};

// Componente de pantalla protegida
export const ProtectedScreen = () => {
  const { user } = useAuth();

  return (
    <View>
      <Text>Bienvenido, usuario autenticado!</Text>
      <Text>Tu token es: {user.token}</Text>
    </View>
  );
};

// Componente principal que maneja la navegación basada en el estado de autenticación
export const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <View>
      {user ? <ProtectedScreen /> : <LoginScreen />}
    </View>
  );
};