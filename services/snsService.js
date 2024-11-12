import AWS from 'aws-sdk';

AWS.config.update({
  region: 'us-east-1', // Tu región de AWS
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const sns = new AWS.SNS();

export const subscribeToPlatformEndpoint = async (token, orderId) => {
  try {
    // Crear un endpoint para el dispositivo
    const params = {
      PlatformApplicationArn: process.env.AWS_PLATFORM_APPLICATION_ARN,
      Token: token,
      CustomUserData: orderId.toString(), // Identificador único del pedido
      Attributes: {
        Enabled: 'true',
      }
    };

    const endpoint = await sns.createPlatformEndpoint(params).promise();
    
    // Suscribir el endpoint al tópico específico del pedido
    const subscribeParams = {
      TopicArn: `${process.env.AWS_TOPIC_ARN_PREFIX}-${orderId}`,
      Protocol: 'application',
      Endpoint: endpoint.EndpointArn,
      ReturnSubscriptionArn: true
    };

    const subscription = await sns.subscribe(subscribeParams).promise();
    return {
      endpointArn: endpoint.EndpointArn,
      subscriptionArn: subscription.SubscriptionArn
    };
  } catch (error) {
    console.error('Error al suscribirse a SNS:', error);
    throw error;
  }
};

// Función para eliminar la suscripción cuando ya no se necesita
export const unsubscribeFromTopic = async (subscriptionArn) => {
  try {
    await sns.unsubscribe({
      SubscriptionArn: subscriptionArn
    }).promise();
  } catch (error) {
    console.error('Error al desuscribirse de SNS:', error);
    throw error;
  }
}; 