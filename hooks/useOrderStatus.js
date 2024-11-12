import { useState, useEffect } from 'react';
import { subscribeToPlatformEndpoint } from '../services/snsService';
import * as Notifications from 'expo-notifications';
import { useNotification } from '../context/NotificationContext';
import { useGetOrderStatusQuery } from '../redux/apis/order';

export const useOrderStatus = (orderId) => {
    const [orderStatus, setOrderStatus] = useState('pending');
    const [message, setMessage] = useState('Tu pedido ha sido realizado con éxito. Pronto te avisaremos cuando puedas retirarlo.');
    const { expoPushToken } = useNotification();
    
    const { data: orderData, refetch } = useGetOrderStatusQuery(orderId, {
        pollingInterval: 0,
    });

    const updateOrderState = (status) => {
        setOrderStatus(status);
        
        // Actualizar el mensaje según el estado
        switch (status) {
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
    };

    useEffect(() => {
        const setupNotifications = async () => {
            try {
                if (!expoPushToken) return;

                // Suscribirse al tópico SNS
                console.log("expoPushToken: ", expoPushToken, "\norderId: ", orderId);
                await subscribeToPlatformEndpoint(expoPushToken, orderId);

                // Configurar el listener de notificaciones
                const notificationListener = Notifications.addNotificationReceivedListener(
                    async (notification) => {
                        const data = notification.request.content.data;
                        
                        // Verificar si la notificación es para este pedido
                        if (data.orderId === orderId) {
                            // Mostrar notificación push
                            await Notifications.scheduleNotificationAsync({
                                content: {
                                    title: 'Actualización de tu pedido',
                                    body: data.message || 'Tu pedido ha sido actualizado',
                                    data: data,
                                },
                                trigger: null, // Mostrar inmediatamente
                            });

                            // Actualizar el estado local
                            updateOrderState(data.status);
                            
                            // Actualizar los datos del pedido desde el backend
                            await refetch();
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
            updateOrderState(orderData.status);
        }
    }, [orderData]);

    return { orderStatus, message };
}; 