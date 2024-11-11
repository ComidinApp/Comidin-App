import { View, StyleSheet, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useSelector } from 'react-redux';
import { selectRestaurant } from '../redux/slices/restaurantSlice';
import * as Icon from "react-native-feather";
import { useNavigation } from '@react-navigation/native';

export default function DirectionsScreen() {
    const navigation = useNavigation();
    const restaurant = useSelector(selectRestaurant);
    const [userLocation, setUserLocation] = useState(null);
    const [restaurantCoords, setRestaurantCoords] = useState(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [userAddress, setUserAddress] = useState('');
    const mapRef = useRef(null);

    useEffect(() => {
        StatusBar.setBackgroundColor('#D67030');
        getLocationsAndRoute();
        return () => {
            StatusBar.setBackgroundColor('#F4511E');
        };
    }, []);

    const getLocationsAndRoute = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            const userLoc = await Location.getCurrentPositionAsync({});
            const userCoords = {
                latitude: userLoc.coords.latitude,
                longitude: userLoc.coords.longitude,
            };
            setUserLocation(userCoords);

            const userGeocode = await Location.reverseGeocodeAsync(userCoords);
            if (userGeocode.length > 0) {
                setUserAddress(`${userGeocode[0].street} ${userGeocode[0].streetNumber}, ${userGeocode[0].city}`);
            }

            const restaurantAddress = `${restaurant.street_name} ${restaurant.number}, ${restaurant.city}`;
            const geocodedLocation = await Location.geocodeAsync(restaurantAddress);

            if (geocodedLocation.length > 0) {
                const restCoords = {
                    latitude: geocodedLocation[0].latitude,
                    longitude: geocodedLocation[0].longitude,
                };
                setRestaurantCoords(restCoords);

                if (mapRef.current) {
                    mapRef.current.fitToCoordinates(
                        [userCoords, restCoords],
                        {
                            edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
                            animated: true,
                        }
                    );
                }

                // Obtener ruta
                const apiKey = process.env.EXPO_PUBLIC_API_GOOGLE_MAPS;
                const origin = `${userCoords.latitude},${userCoords.longitude}`;
                const destination = `${restCoords.latitude},${restCoords.longitude}`;
                
                const response = await fetch(
                    `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`
                );
                
                const result = await response.json();
                
                if (result.routes.length > 0) {
                    const points = decodePolyline(result.routes[0].overview_polyline.points);
                    setRouteCoordinates(points);
                }
            }
        } catch (error) {
            // Manejo silencioso del error
        }
    };

    const decodePolyline = (encoded) => {
        const points = [];
        let index = 0, lat = 0, lng = 0;

        while (index < encoded.length) {
            let shift = 0, result = 0;
            let byte;
            do {
                byte = encoded.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);
            const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                byte = encoded.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);
            const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += dlng;

            points.push({
                latitude: lat * 1e-5,
                longitude: lng * 1e-5,
            });
        }
        return points;
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: userLocation?.latitude || -31.419687,
                    longitude: userLocation?.longitude || -64.188938,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {userLocation && (
                    <Marker
                        coordinate={userLocation}
                        title="Tu ubicación"
                        description={userAddress}
                        pinColor="#D67030"
                    />
                )}
                {restaurantCoords && (
                    <Marker
                        coordinate={restaurantCoords}
                        title={restaurant.name}
                        description={`${restaurant.street_name} ${restaurant.number}, ${restaurant.city}`}
                        pinColor="#FEFAE0"
                    />
                )}
                {routeCoordinates.length > 0 && (
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeWidth={4}
                        strokeColor="#95541b"
                        geodesic={true}
                        zIndex={1}
                    />
                )}
            </MapView>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Icon.ArrowLeft height="24" width="24" stroke="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: '#D67030',
        padding: 8,
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
}); 