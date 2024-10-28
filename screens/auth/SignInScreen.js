import React, { useState, useContext } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import CustomInput from "../../components/formElements/CustomInput.js";
import CustomButton from "../../components/formElements/CustomButton.js";
import SocialSignInButtons from "../../components/formElements/SocialSignInButtons.js";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuth } from '../../context/AuthContext.js';


export default function SignInScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const { signIn } = useAuth();


  const onForgotPasswordPressed = () => {
    navigation.navigate("ForgotPassword");
  };

  const onSignUpPress = () => {
    navigation.navigate("SignUp");
  };

  return (
    <SafeAreaView
      className='bg-comidin-dark-orange pt-3'
    >
    <ImageBackground 
    source={require("../../assets/images/backgroundComidin.png")} resizeMode="cover" 
    className="h-full bg-transparent">
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="h-full bg-comidin-light-orange/70"
    >

        <StatusBar style="dark-content" />
        <View className="items-center">
          <Text className="font-bold text-3xl text-comidin-dark-orange py-8">
            ¡Te damos la bienvenida!
          </Text>
          <View className="px-9 w-full">
            <CustomInput
              placeholder="Usuario"
              value={username}
              setValue={setUsername}
            />
            <CustomInput
              placeholder="Contraseña"
              value={password}
              setValue={setPassword}
              secureTextEntry
            />
            <View className="w-full py-5">
              <CustomButton text="Ingresar" onPress={() => signIn(username, password)} />
              <CustomButton
                text="Recuperar contraseña"
                onPress={onForgotPasswordPressed}
                type="TERTIARY"
              />
            </View>

            <View className="flex items-center mt-12">
              <SocialSignInButtons />
              <TouchableOpacity
                onPress={onSignUpPress}
                className="py-2 flex flex-row"
              >
                <Text className="text-black text-lg font-semibold">
                  ¿No tienes cuenta? Regístrate
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    </ScrollView>
        </ImageBackground>
    </SafeAreaView>
  );
}
