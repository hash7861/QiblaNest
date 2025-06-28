import { GOOGLE_PLACES_API_KEY } from '@env';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

// Type for a masjid marker
type Masjid = {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
};

const MapScreen = () => {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [masjids, setMasjids] = useState<Masjid[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Allow location access to use this feature');
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);

      try {
        const { latitude, longitude } = userLocation.coords;
        const radius = 3000; // meters
        const type = 'mosque';
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.results) {
          const nearbyMasjids: Masjid[] = data.results.map((place: any) => ({
            id: place.place_id,
            name: place.name,
            description: place.vicinity || '',
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
          }));
          setMasjids(nearbyMasjids);
        } else {
          console.warn('No masjids found nearby.');
        }
      } catch (error) {
        console.error('Failed to fetch masjids:', error);
      }
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
