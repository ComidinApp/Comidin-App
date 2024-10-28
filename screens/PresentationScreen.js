import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  Dimensions
} from "react-native";
import CustomButton from "../components/formElements/CustomButton.js";
import { useNavigation } from "@react-navigation/core";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const { height } = Dimensions.get('window');
const marginTop = height * 0.1;  // El 10% de la altura de la pantalla
const marginBottom = height * 0.05;  // El 10% de la altura de la pantalla

export default function PresentationScreen() {
  const navigation = useNavigation();

  const onSignInPressed = async (data) => {
    // const response = Auth.signIn(data.username, data.password);
    // validate user
    navigation.navigate("SignIn");
  };

  const onSignUpPress = () => {
    navigation.navigate("SignUp");
  };

  return (
    <SafeAreaView className="bg-comidin-light-orange flex-1">
      <ImageBackground
        source={require("../assets/images/backgroundComidin.png")}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="flex-1 px-6 bg-comidin-light-orange/70">
          <View style={{marginTop}}>
            <Image 
              resizeMode="contain" 
              className="w-full aspect-auto" 
              source={require("../assets/images/logoComidin.png")}
            />
          </View>
          
          <View className="flex-1" />
          
          <View className="items-center mb-20">
            <CustomButton text="Ingresar" onPress={onSignInPressed} />
            <TouchableOpacity
              onPress={onSignUpPress}
              className="flex flex-row mt-2"
            >
              <Text className="text-black text-lg font-semibold">
                ¿No tienes cuenta? {" "}
              </Text>
              <Text className="text-comidin-dark-orange text-lg font-semibold">
                Registrate
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
