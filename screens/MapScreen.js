import { Button, Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import CustomButton from "../components/formElements/CustomButton.js";
import { useNavigation } from '@react-navigation/native';

export default function Map() {
  const initialLocation = {
    latitude: -31.419687,
    longitude: -64.188938,
  }
  const [myLocation, setMyLocation] = useState(initialLocation)
  const [pin, setPin] = useState({})
  const [region, setRegion] = useState({
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
});
  const mapRef = useRef(null)
  const local = {
    latitude: "-31.419687",
    longitude: "-64.188938"
  }

  const [address, setAddress] = useState(null)
  const [draggableMarkerCoords, setDraggableMarkerCoords] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    setPin(local);
    _getLocation();
  }, []);

  const _getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({});
      setMyLocation(location.coords);
      // Inicializar el marcador draggable en la ubicación actual
      setDraggableMarkerCoords({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      
      if (reverseGeocode.length > 0) {
        setAddress(reverseGeocode[0]);
      }
    } catch(err) {
      console.warn(err);
    }
  }

  const focusOnLocation = () => {
    if (myLocation.latitude && myLocation.longitude) {
      const newRegion = {
        latitude: parseFloat(myLocation.latitude),
        longitude: parseFloat(myLocation.longitude),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      };
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 500);
        // También actualizamos la posición del marcador
        setDraggableMarkerCoords({
          latitude: parseFloat(myLocation.latitude),
          longitude: parseFloat(myLocation.longitude),
        });
      }
    }
  };

  const handleConfirmLocation = async () => {
    if (draggableMarkerCoords) {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: draggableMarkerCoords.latitude,
        longitude: draggableMarkerCoords.longitude
      });

      if (reverseGeocode.length > 0) {
        navigation.navigate('Address', { location: reverseGeocode[0] });
      }
    }
  };

  const handleMapPress = (e) => {
    // Actualiza la posición del marcador al punto donde el usuario tocó
    setDraggableMarkerCoords(e.nativeEvent.coordinate);
    
    // Anima suavemente hacia la nueva ubicación
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      }, 500); // 500ms de duración de la animación
    }
  };

  return (
    <View className='flex-1 items-center justify-center'>
      <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        ref={mapRef}
        provider='google'
        onPress={handleMapPress}
      >
        {draggableMarkerCoords && (
          <Marker
            coordinate={draggableMarkerCoords}
            title='Ubicación de entrega'
            description='Toca el mapa para cambiar la ubicación'
          />
        )}
      </MapView>
      
      <View className='absolute bottom-5 w-full px-3'>
        <View className='flex-row space-x-2'>
          <View className='flex-1'>
            <CustomButton
              text="Mi ubicación"
              onPress={focusOnLocation}
              type="SECONDARY"
            />
          </View>
          <View className='flex-1'>
            <CustomButton
              text="Confirmar ubicación"
              onPress={handleConfirmLocation}
              type="PRIMARY"
            />
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  markerImage: {
    width: 40,
    height: 40, 
    borderRadius: 20,
  }
})
