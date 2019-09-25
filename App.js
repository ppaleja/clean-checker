import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  ImageBackground,
  KeyboardAvoidingView, 
  TextInput,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { fetchSong, fetchLyrics } from './utils/api';

import SearchInput from './components/SearchInput';

const swearWords = [
  'fuck',
  'shit', 
  'bitch', 
  'cunt', 
  'pussy', 
  'dick', 
  'faggot', 
  'bastard', 
  'nigga',
  'nigger',
]

export default class App extends React.Component {

  // Mounts the component and sets empty string in search box
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: false,
      song: '',
      artist: '',
      coverLink: 'https://www.macmillandictionary.com/external/slideshow/full/White_full.png',
      cleanCheck: '',
      numSwears: '',
      rating: '',
    }
  }

  componentDidMount() {
    this.handleUpdateSong('Bank Account by 21 savage')
  }


  handleUpdateSong = async (songName) => {
    if(!songName) {
      return;
    }

    this.setState({ loading: true }, async() => {
      try {
        const { 
          albumId,
          songId,
          artistId,
          artist,
          song,
          coverLink 
        } = await fetchSong(songName); // TODO the rest of the song stuff
        
        const lyrics = await fetchLyrics(artistId, songId, albumId);
        const { cleanCheck, numSwears, rating } = this.checkLyrics(lyrics);
        

        this.setState({
          loading: false,
          error: false,
          song,
          artist,
          coverLink,
          cleanCheck,
          numSwears,
          rating,
        }); 
      } catch (e) {
        this.setState({
          loading: false,
          error: true,
        });
      }
    });
  };

  checkLyrics = (lyrics) => {
    try {
      lyrics = lyrics.toLowerCase();
      let lyricsArray = lyrics.split(' ');
      let count = 0;
      
      for(let i = 0; i < lyricsArray.length; i++) {
        // Check if the current word has the newline char
        if(lyricsArray[i].search('\n') != -1) {

          let splitStr = lyricsArray[i].split('\n');

          // Algorithm to add in the newly split array into the original array
          let j = 0;
          for(j = 0; j < splitStr.length; j++) {
            lyricsArray.splice(i + j, 0, splitStr[j]);
          }
          lyricsArray.splice(i + j, 1);
        }


        // Check for swearwords
        for(let k = 0; k < swearWords.length; k++) {
          if (lyricsArray[i].search(swearWords[k]) != -1) {
            count++;
          }
        }
      }

      // Return the results
      rating = 100 - (count / lyricsArray.length * 100);
      return {
        cleanCheck: (count === 0 ? 'Yes' : 'No'),
        numSwears: count,
        rating: rating.toFixed(2),
      }
    } catch (e) {
      this.setState({
        loading: false,
        error: true,
      });
    }
  };
  
  render() {
    const { 
      loading, 
      error, 
      song, 
      artist, 
      coverLink, 
      cleanCheck, 
      numSwears, 
      rating } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container}>
        <StatusBar barStyle='light-content'/>
        <ImageBackground
          source={{uri: `${coverLink}`}}
          style={styles.imageContainer}
          imageStyle={styles.image}
        >
          <View style={styles.detailsContainer}>
            <ActivityIndicator animating={loading} color='white' size='large'/>
            {!loading && (
              <View>
                {error && (
                  <View>
                    <Text style={[styles.smallText, styles.textStyle]}>
                      Could not load lyrics, please try a different city.
                    </Text>
                    <SearchInput 
                      placeholder='Search any song'
                      onSubmit={this.handleUpdateSong}
                    />
                  </View>
                )}

                {!error && (
                  <View>
                    <Text style={[styles.largeText, styles.titleTextStyle]}>{song}</Text>
                    <Text style={[styles.smallText, styles.titleTextStyle]}>{artist}</Text>
                    <SearchInput 
                      placeholder='Search any song'
                      onSubmit={this.handleUpdateSong}
                    />
                    <View style={styles.infoContainer}>
                      <View style={styles.categoriesContainer}>
                        <Text style={[styles.largeText, styles.infoTextStyle]}>Clean?</Text>
                        <Text style={[styles.largeText, styles.infoTextStyle]}>Swears: </Text>
                        <Text style={[styles.largeText, styles.infoTextStyle]}>Rating: </Text>
                      </View>
                      <View style={styles.responseContainer}>
                        <View justifyContent='center'>
                          <Text style={[styles.largeText, styles.infoTextStyle]}>{cleanCheck}</Text>
                          <Text style={[styles.largeText, styles.infoTextStyle]}>{numSwears}</Text>
                          <Text style={[styles.largeText, styles.infoTextStyle]}>{rating}%</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            )}     
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
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  categoriesContainer: {

  },
  responseContainer: {

  },
  titleTextStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white',
  },
  infoTextStyle: {
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
