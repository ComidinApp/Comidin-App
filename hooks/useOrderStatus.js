import { useState, useEffect } from 'react';
import { subscribeToPlatformEndpoint } from '../services/snsService';
import * as Notifications from 'expo-notifications';
import { useNotification } from '../context/NotificationContext';
import { useGetOrderStatusQuery } from '../redux/apis/order';

export const useOrderStatus = (orderId) => {
    const [orderStatus, setOrderStatus] = useState('pending');
    const [message, setMessage] = useState('Tu pedido ha sido realizado con éxito. Pronto te avisaremos cuando puedas retirarlo.');
    const { expoPushToken } = useNotification();
    
    // Query para obtener el estado actual del pedido
    const { data: orderData, refetch } = useGetOrderStatusQuery(orderId, {
        pollingInterval: 0, // Desactivamos el polling automático
    });

    useEffect(() => {
        const setupNotifications = async () => {
            try {
                if (!expoPushToken) return;

                // Suscribirse al tópico SNS específico para este pedido
                await subscribeToPlatformEndpoint(expoPushToken);

                // Configurar el listener de notificaciones
                const notificationListener = Notifications.addNotificationReceivedListener(
                    (notification) => {
                        const data = notification.request.content.data;
                        
                        // Verificar si la notificación es para este pedido
                        if (data.orderId === orderId) {
                            // Actualizar el estado local
                            setOrderStatus(data.status);
                            
                            // Actualizar el mensaje según el estado
                            switch (data.status) {
                                case 'confirmed':
                                    setMessage('¡Tu pedido ha sido confirmado! Estamos preparándolo.');
                                    break;
                                case 'ready':
                                    setMessage('¡Tu pedido está listo para retirar!');
                                    break;
                                case 'completed':
                                    setMessage('¡Gracias por tu compra!');
                                    break;
                                case 'cancelled':
                                    setMessage('Lo sentimos, tu pedido ha sido cancelado.');
                                    break;
                                default:
                                    setMessage('Tu pedido ha sido realizado con éxito. Pronto te avisaremos cuando puedas retirarlo.');
                            }

                            // Actualizar los datos del pedido desde el backend
                            refetch();
                        }
                    }
                );

                return () => {
                    Notifications.removeNotificationSubscription(notificationListener);
                };
            } catch (error) {
                console.error('Error setting up notifications:', error);
            }
        };

        setupNotifications();
    }, [orderId, expoPushToken]);

    // Actualizar el estado cuando cambian los datos del pedido
    useEffect(() => {
        if (orderData) {
            setOrderStatus(orderData.status);
        }
    }, [orderData]);

    return { orderStatus, message };
}; 