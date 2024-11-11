import AWS from 'aws-sdk';

// Configura tus credenciales de AWS
AWS.config.update({
  region: 'TU_REGION',
  accessKeyId: 'TU_ACCESS_KEY',
  secretAccessKey: 'TU_SECRET_KEY'
});

const sns = new AWS.SNS();

export const subscribeToPlatformEndpoint = async (token) => {
  try {
    // Crear un endpoint para el dispositivo
    const params = {
      PlatformApplicationArn: 'TU_PLATFORM_APPLICATION_ARN', // ARN de tu aplicación en SNS
      Token: token
    };

    const endpoint = await sns.createPlatformEndpoint(params).promise();
    
    // Suscribir el endpoint al tópico
    const subscribeParams = {
      TopicArn: 'TU_TOPIC_ARN', // ARN de tu tópico SNS
      Protocol: 'application', // Para notificaciones push
      Endpoint: endpoint.EndpointArn
    };

    const subscription = await sns.subscribe(subscribeParams).promise();
    return subscription;
  } catch (error) {
    console.error('Error al suscribirse a SNS:', error);
    throw error;
  }
}; 