import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomDrawerContent = ({ navigation }) => {
  const menuItems = [
    { name: 'HomeScreen', title: 'Inicio' },
    { name: 'UserProfile', title: 'Perfil' },
    { name: 'Orders', title: 'Pedidos' },
    { name: 'SavedAddresses', title: 'Direcciones' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-comidin-dark-orange">
      <View className="pt-8 pb-4 px-4 bg-comidin-dark-orange">
        <Text className="text-white text-xl font-bold">Comidín</Text>
      </View>
      <View className="flex-1 px-4 py-2">
        {menuItems.map((item) => (
          <TouchableOpacity 
            key={item.name}
            className="py-3 px-4 flex-row items-center bg-comidin-light-orange rounded-lg my-2"
            onPress={() => navigation.navigate(item.name)}
          >
            <Text className="text-lg text-comidin-green">{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default CustomDrawerContent;