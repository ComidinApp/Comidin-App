import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const ProfileScreen = () => {
    const { logout } = useAuth();
    const { clearPushToken } = useNotification();

    const handleLogout = async () => {
        try {
            await Promise.all([
                logout(),
                clearPushToken()
            ]);
            // Navegar a la pantalla de login o hacer lo que sea necesario
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    // ... rest of the component ...
}; 