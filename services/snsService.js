import AWS from 'aws-sdk';

AWS.config.update({
  region: 'us-east-1', // Tu región de AWS
  accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY
});

const sns = new AWS.SNS();

export const subscribeToPlatformEndpoint = async (token, orderId) => {
  try {
    // Primero intentamos obtener el endpoint existente
    const listEndpointsParams = {
      PlatformApplicationArn: process.env.EXPO_PUBLIC_AWS_PLATFORM_APPLICATION_ARN,
    };
    
    const endpoints = await sns.listEndpointsByPlatformApplication(listEndpointsParams).promise();
    const existingEndpoint = endpoints.Endpoints.find(endpoint => 
      endpoint.Attributes.Token === token
    );

    let endpointArn;

    if (existingEndpoint) {
      // Si existe, actualizamos sus atributos
      const updateParams = {
        EndpointArn: existingEndpoint.EndpointArn,
        Attributes: {
          Token: token,
          CustomUserData: orderId.toString(),
          Enabled: 'true'
        }
      };
      await sns.setEndpointAttributes(updateParams).promise();
      endpointArn = existingEndpoint.EndpointArn;
    } else {
      // Si no existe, creamos uno nuevo
      const createParams = {
        PlatformApplicationArn: process.env.EXPO_PUBLIC_AWS_PLATFORM_APPLICATION_ARN,
        Token: token,
        CustomUserData: orderId.toString(),
        Attributes: {
          Enabled: 'true',
        }
      };
      const endpoint = await sns.createPlatformEndpoint(createParams).promise();
      endpointArn = endpoint.EndpointArn;
    }
    
    // Suscribir el endpoint al tópico
    const subscribeParams = {
      TopicArn: `${process.env.EXPO_PUBLIC_AWS_TOPIC_ARN_PREFIX}`,
      Protocol: 'application',
      Endpoint: endpointArn,
      ReturnSubscriptionArn: true
    };

    const subscription = await sns.subscribe(subscribeParams).promise();
    return {
      endpointArn: endpointArn,
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