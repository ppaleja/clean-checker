import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  ImageBackground,
  KeyboardAvoidingView, 
  TextInput,
  Platform
} from 'react-native';

import SearchInput from './components/SearchInput'
import getImageForAlbum from './utils/getImageForAlbum'

export default class App extends React.Component {
  render() {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <ImageBackground
          source={getImageForAlbum('temp')}
          style={styles.imageContainer}
          imageStyle={styles.image}
        >
          <View style={styles.detailsContainer}>
            <SearchInput placeholder="Search any song"/>
              <Text style={[styles.largeText, styles.textStyle]}>Clean?</Text>
              <Text style={[styles.largeText, styles.textStyle]}># of Swears:</Text>
              <Text style={[styles.largeText, styles.textStyle]}>Rating:</Text>

          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.6)',
    paddingHorizontal: 20,
  },

  textStyle: {
    textAlign: 'left',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white',
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18,
  },
});
