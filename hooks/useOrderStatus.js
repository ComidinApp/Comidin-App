import { useState, useEffect } from 'react';
import { subscribeToPlatformEndpoint } from '../services/snsService';
import * as Notifications from 'expo-notifications';

export const useOrderStatus = (orderId) => {
    const [orderStatus, setOrderStatus] = useState('pending');
    const [message, setMessage] = useState('Tu pedido ha sido realizado con éxito. Pronto te avisaremos cuando puedas retirarlo.');

    useEffect(() => {
        const setupNotifications = async () => {
            // Pedir permisos para notificaciones
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('No notification permissions!');
                return;
            }

            // Obtener el token de Expo
            const tokenData = await Notifications.getExpoPushTokenAsync();
            
            try {
                // Suscribirse al tópico SNS
                await subscribeToPlatformEndpoint(tokenData.data);

                // Configurar el manejador de notificaciones
                Notifications.addNotificationReceivedListener((notification) => {
                    const data = notification.request.content.data;
                    
                    if (data.orderId === orderId) {
                        setOrderStatus(data.status);
                        switch (data.status) {
                            case 'ready':
                                setMessage('¡Tu pedido está listo para retirar!');
                                break;
                            case 'completed':
                                setMessage('¡Gracias por tu compra!');
                                break;
                            default:
                                setMessage('Tu pedido ha sido realizado con éxito. Pronto te avisaremos cuando puedas retirarlo.');
                        }
                    }
                });
            } catch (error) {
                console.error('Error setting up notifications:', error);
            }
        };

        setupNotifications();

        // Cleanup
        return () => {
            Notifications.removeAllNotificationListeners();
        };
    }, [orderId]);

    return { orderStatus, message };
}; 