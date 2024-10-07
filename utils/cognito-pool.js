import {CognitoUserPool} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId:  process.env.EXPO_PUBLIC_USER_POOL,
  ClientId: process.env.EXPO_PUBLIC_CLIENT_ID,
};

export const cognitoPool = new CognitoUserPool(poolData);
