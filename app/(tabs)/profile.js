import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    FadeInUp,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';
import StatusBar from '../../components/common/StatusBar';
import { colors } from '../../constants/colors';

const { width } = Dimensions.get('window');

const ChildProfileScreen = ({ navigation }) => {
  const [children, setChildren] = useState([
    {
      id: 1,
      name: 'Johnny',
      age: '4yrs',
      avatar: null,
      hasPhoto: true
    }
  ]);
  const [selectedChild, setSelectedChild] = useState(0);

  const handleAddPhoto = async (childId) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const updatedChildren = children.map(child => 
        child.id === childId 
          ? { ...child, avatar: result.assets[0].uri, hasPhoto: true }
          : child
      );
      setChildren(updatedChildren);
    }
  };

  const handleAddNewChild = () => {
    if (navigation) {
      navigation.navigate('profile/setup', { isNewChild: true });
    }
  };

  const ChildCard = ({ child, index }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      };
    });

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 100).springify()}
        style={animatedStyle}
      >
        <TouchableOpacity
          style={styles.childCard}
          onPress={() => setSelectedChild(index)}
          activeOpacity={0.8}
        >
          <View style={styles.avatarContainer}>
            {child.hasPhoto ? (
              <Image 
                source={child.avatar ? { uri: child.avatar } : require('../../assets/images/sample-child.jpg')}
                style={styles.avatar}
              />
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => handleAddPhoto(child.id)}
              >
                <Ionicons name="camera" size={24} color={colors.text.secondary} />
                <Text style={styles.uploadText}>Upload Photo</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={styles.childName}>{child.name}</Text>
          <Text style={styles.childAge}>Age: {child.age}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <Image 
          source={require('../../assets/images/logo/platefull-mascot.png')}
          style={styles.mascot}
        />
        <Text style={styles.welcomeText}>Welcome to PLATEFULL</Text>
        <Text style={styles.subtitleText}>Let's get started.</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.contentHeader}>
          <Text style={styles.title}>Childs Profile</Text>
          <Text style={styles.subtitle}>Let's Explore About Your Childs Meal!</Text>
        </View>

        <ScrollView 
          style={styles.childrenList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.childrenGrid}>
            {children.map((child, index) => (
              <ChildCard key={child.id} child={child} index={index} />
            ))}
            
            <Animated.View
              entering={FadeInUp.delay(children.length * 100).springify()}
            >
              <TouchableOpacity
                style={styles.addChildCard}
                onPress={handleAddNewChild}
                activeOpacity={0.8}
              >
                <View style={styles.addChildButton}>
                  <Ionicons name="add" size={32} color={colors.text.inverse} />
                </View>
                <Text style={styles.addChildText}>Add New Child's Profile</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Text style={styles.previousText}>Previous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => navigation?.navigate('Main')}
          >
            <Ionicons name="arrow-forward" size={24} color={colors.text.inverse} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  mascot: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: colors.text.inverse,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingTop: 24,
  },
  contentHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  childrenList: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  childrenGrid: {
    alignItems: 'center',
  },
  childCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    width: width - 48,
    elevation: 2,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  uploadButton: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 8,
  },
  childName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  childAge: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  addChildCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  addChildButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  addChildText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  previousText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default ChildProfileScreen;