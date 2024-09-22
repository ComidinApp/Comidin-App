import React, { useState } from "react";
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
import { themeColors } from "../../theme/index.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function SignInScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  const onSignInPressed = async (data) => {
    // const response = Auth.signIn(data.username, data.password);
    // validate user
    navigation.navigate("Home");
  };

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
    <ImageBackground source={require("../../assets/images/login.jpg")} resizeMode="cover" className="h-full bg-transparent">
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="h-full"
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
            <View className="w-full px-10 py-5">
              <CustomButton text="Ingresar" onPress={onSignInPressed} />
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
                  ¿No tienes cuenta?{" "}
                </Text>
                <Text className="text-comidin-dark-orange text-lg font-semibold">
                  Regístrate
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
