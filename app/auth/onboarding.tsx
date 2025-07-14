import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../../app/firebase';
import { colors } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef<Video>(null);

  // Fetch intro video URL from Firestore
  useEffect(() => {
    const fetchIntroVideo = async () => {
      try {
        const videoDoc = await getDoc(doc(db, 'appConfig', 'introVideo'));
        if (videoDoc.exists()) {
          const data = videoDoc.data();
          setVideoUrl(data.url);
        } else {
          console.log('No intro video found in Firestore');
          // Fallback: navigate to sign-in if no video
          router.replace('/auth/sign-in');
        }
      } catch (error) {
        console.error('Error fetching intro video:', error);
        Alert.alert('Error', 'Failed to load intro video');
        // Fallback: navigate to sign-in on error
        router.replace('/auth/sign-in');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIntroVideo();
  }, []);

  const handleVideoLoad = () => {
    setIsVideoReady(true);
  };

  const handleVideoEnd = () => {
    // Navigate to sign-in when video ends
    router.replace('/auth/sign-in');
  };

  const handleSkip = () => {
    router.replace('/auth/sign-in');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.background}
        >
          <View style={styles.loadingContainer}>
            <Ionicons name="refresh" size={40} color={colors.text.inverse} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (!videoUrl) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.background}
        >
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={40} color={colors.text.inverse} />
            <Text style={styles.errorText}>No intro video available</Text>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.background}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: videoUrl }}
            style={styles.video}
            useNativeControls={false}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={true}
            isLooping={false}
            onLoad={handleVideoLoad}
            onPlaybackStatusUpdate={(status) => {
              if (status.isLoaded && status.didJustFinish) {
                handleVideoEnd();
              }
            }}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  skipText: {
    fontSize: 16,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  video: {
    width: width - 40,
    height: (width - 40) * 0.5625, // 16:9 aspect ratio
    borderRadius: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: colors.text.inverse,
    marginTop: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 18,
    color: colors.text.inverse,
    marginTop: 16,
    marginBottom: 32,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default OnboardingScreen; 