import React from 'react';
import {View, Text} from 'react-native';
import CustomButton from './CustomButton.js';
import * as Icon from "react-native-feather";
import AuthGoogle from '../../utils/auth';

const SocialSignInButtons = () => {
  const onSignInFacebook = () => {
    console.warn('onSignInFacebook');
  };

  // const onSignInGoogle = () => {
  //   console.warn('onSignInGoogle');
  //   <authGoogle/>
  // };

  return (
    <>
      <CustomButton
        text="Iniciar con Facebook"
        onPress={onSignInFacebook}
      />
      <AuthGoogle/>
    </>
  );
};

export default SocialSignInButtons;
