import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import socket from './src/config/socket'; // Import the socket instance
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import { useToast } from "react-native-toast-notifications";
import MapView, { Marker } from 'react-native-maps';


const App = () => {

  const [position, setPosition] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });
  const toast = useToast();
  const [connect, setsocket] = useState(socket)
  const [location, setLocation] = useState(null);
  const [isSocketConnected, setSocketConnected] = useState(false)
  const origin = { latitude: 37.3318456, longitude: -122.0296002 };
  const destination = { latitude: 37.771707, longitude: -122.4053769 };
  const GOOGLE_MAPS_APIKEY = 'AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v';
  const [serverresponse, setserverresponse] = useState(null)

  useEffect(() => {
    connect.on("connect", () => {
      setSocketConnected(true);
      console.log("am connectted to my sever", isSocketConnected)
    })
    connect.on("hello", (data) => {
      console.log(data, "heelllow data ")
      setserverresponse(data)
    })
    connect.on("hello2", (data) => {
      setserverresponse(data)
    })
    connect.on("hello3", (data) => {
      setserverresponse(data)
    })

    return () => {
      connect.disconnect()
    }

  }, []);

  const custmfun = () => {
    console.log("hello1", connect);
    connect.emit('message', { text: 'Hello from React Native!' });
    console.log("hello2");
  }

  useEffect(() => {
    Geolocation.getCurrentPosition((pos) => {
      const crd = pos.coords;
      setPosition({
        latitude: crd.latitude,
        longitude: crd.longitude,
        latitudeDelta: 0.0421,
        longitudeDelta: 0.0421,
      });
    }, (err) => {
      console.log(err);
    });
  }, []);

  // Request permissions (Android only)
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'We need access to your location',
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission denied');
        return;
      }
    }
  };

  useEffect(() => {
    // Request permission on mount
    requestLocationPermission();
    // let id = toast.show("Loading... And Fetching Location!");
    // Get initial location
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
        // toast.update(id, "Current position:" + JSON.stringify(position.coords), { type: 'success' });
      },
      (error) => {
        console.log('Error getting current position:', error);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
    );

    // Watch location for changes
    const watchId = Geolocation.watchPosition(
      (position) => {
        setLocation(position.coords);
        console.log('Position updated:', position.coords);
      },
      (error) => {
        console.log('Error watching position:', error);
      },
      { enableHighAccuracy: true, distanceFilter: 10, interval: 2000 }
    );

    // Cleanup function to remove location watch when the component unmounts
    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  const updateLocation = () => {
    console.log("updateLocation");
    connect.emit('updateLocation', {
      userId: '675ad2003bc9b4f32940e160',
      latitude: 40.71281, // Replace with actual lat/long from GPS
      longitude: -74.00600,
      heading: 90, // Replace with actual heading/direction
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <Text style={{ fontSize: 30, color: "white" }}>{serverresponse}</Text>
        <TouchableOpacity style={{ height: 20, width: 100, backgroundColor: "white", alignItems: 'center' }} onPress={() => custmfun()}>
          <Text>Send Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ height: 20, width: 100, backgroundColor: "red", marginTop: 10, alignItems: 'center' }} onPress={() => updateLocation()}>
          <Text style={{ color: '#FFF' }}>Update Location X</Text>
        </TouchableOpacity>
      </View>
      <MapView
        style={styles.map}
        initialRegion={position}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        showsCompass={true}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        mapType={Platform.OS == "android" ? "none" : "standard"}
      >
        <Marker />
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY}
        />
      </MapView>
    </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});