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
    <SafeAreaView className="bg-comidin-light-orange">
      <ImageBackground
        source={require("../assets/images/backgroundComidin.png")}
        resizeMode="cover"
        imageStyle={{ opacity: 0.6 }}
      >
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="h-full px-6 bg-transparent"
          >
            <View style={{marginTop}}>
              <Image resizeMode="contain" className="w-full aspect-auto" source={require("../assets/images/logoComidin.png")}></Image>
            </View>

            <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom }}>
              <CustomButton text="Ingresar" onPress={onSignInPressed} />
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
          </ScrollView>

      </ImageBackground>
    </SafeAreaView>
  );
}
