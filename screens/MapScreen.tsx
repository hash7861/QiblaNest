import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

// Dummy masjid data
const masjids = [
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
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 39.9612,
          longitude: -82.9988,
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
});
