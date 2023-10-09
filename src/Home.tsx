import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Button,
  SafeAreaView,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import RNTextDetector from 'rn-text-detector';

const Home = () => {
  const [state, setState] = useState<{
    loading: boolean;
    image: string | null;

    textRecognition: [] | null;
  }>({
    loading: false,
    image: null,
    textRecognition: null,
  });

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  console.log('textRecognition', state?.textRecognition);

  function onPress(type: 'capture' | 'library') {
    setState({ ...state, loading: true });

    if (type === 'capture') {
      requestCameraPermission();
      launchCamera({ mediaType: 'photo' }, onImageSelect);
    } else {
      launchImageLibrary({ mediaType: 'photo' }, onImageSelect);
    }
  }
  async function onImageSelect(media: any) {
    if (!media) {
      setState({ ...state, loading: false });
      return;
    }
    if (!!media && media.assets) {
      const file = media.assets[0].uri;
      const textRecognition = await RNTextDetector.detectFromUri(file);

      setState({
        ...state,
        textRecognition,
        image: file,
        loading: false,
      });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={[styles.button, styles.shadow]}
          onPress={() => onPress('capture')}>
          <Text style={styles.title}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.shadow]}
          onPress={() => onPress('library')}>
          <Text style={styles.title}>Pick a Photo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {!!state.textRecognition &&
          state.textRecognition.map((item: { text: string }, i: number) => (
            <Text key={i} style={styles.item}>
              {item.text}
            </Text>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    color: 'white',
  },
  item: {
    color: 'black',
  },
  btnContainer: {
    backgroundColor: '#efefef',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    paddingTop: 10,
  },
  button: {
    height: 50,
    width: 100,
    backgroundColor: 'black',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  shadow: {},
});
export default Home;
