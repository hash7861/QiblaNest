import { GOOGLE_PLACES_API_KEY } from '@env';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

// Confirm the API key is loading (can be removed later)
console.log('Google Places API Key:', GOOGLE_PLACES_API_KEY);

// Type for a masjid marker
type Masjid = {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
};

const masjids: Masjid[] = [
  {
    id: 1,
    name: 'Masjid Omar',
    description: 'Main masjid in downtown',
    latitude: 39.9615,
    longitude: -82.9990,
  },
  {
    id: 2,
    name: 'Masjid Bilal',
    description: 'Known for youth programs',
    latitude: 39.9622,
    longitude: -82.9975,
  },
  {
    id: 3,
    name: 'Masjid Al-Noor',
    description: 'Peaceful and community-driven',
    latitude: 39.9600,
    longitude: -82.9965,
  },
];

const MapScreen = () => {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Allow location access to use this feature');
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
    })();
  }, []);

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {masjids.map((masjid) => (
          <Marker
            key={masjid.id}
            coordinate={{
              latitude: masjid.latitude,
              longitude: masjid.longitude,
            }}
            title={masjid.name}
            description={masjid.description}
          />
        ))}
      </MapView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
