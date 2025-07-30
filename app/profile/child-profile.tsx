import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
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
import StatusBar from '../../components/common/StatusBar';
import { colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

interface ChildProfile {
  id: string;
  name: string;
  age: string;
  avatar?: any;
}

const ChildProfileScreen = () => {
  const [childProfiles, setChildProfiles] = useState<ChildProfile[]>([
    {
      id: '1',
      name: 'Johnny',
      age: '4yrs',
      avatar: require('../../assets/images/avatars/boy.png')
    }
  ]);

  const handleAddChild = () => {
    router.push('/profile/setup');
  };

  const handleEditChild = (childId: string) => {
    router.push({
      pathname: '/profile/setup',
      params: { childId }
    });
  };

  const handleNext = () => {
    router.push('/main');
  };

  return (
    <View style={styles.container}>
      <StatusBar />
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <Image 
          source={require('../../assets/images/logo/platefull-mascot.png')}
          style={styles.mascot}
        />
        <Text style={styles.welcomeText}>Welcome to PLATEFUL!</Text>
        <Text style={styles.subtitleText}>Let's get started.</Text>
      </LinearGradient>
      
      <View style={styles.contentContainer}>
        <View style={styles.contentHeader}>
          <Text style={styles.title}>Child's Profile</Text>
          <Text style={styles.subtitle}>Let's Explore About Your Child's Meal!</Text>
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.profileGrid}>
            {childProfiles.map((child, index) => (
              <TouchableOpacity
                key={child.id}
                style={styles.childCard}
                onPress={() => handleEditChild(child.id)}
              >
                <View style={styles.avatarContainer}>
                  {child.avatar ? (
                    <Image source={child.avatar} style={styles.avatar} />
                  ) : (
                    <View style={styles.uploadContainer}>
                      <Ionicons name="camera" size={32} color={colors.text.secondary} />
                      <Text style={styles.uploadText}>Upload Photo</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childAge}>Age: {child.age}</Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.addChildCard}
              onPress={handleAddChild}
            >
              <View style={styles.addButton}>
                <Ionicons name="add" size={40} color={colors.text.inverse} />
              </View>
              <Text style={styles.addChildText}>Add New Child's Profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.previousText}>Previous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
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
    width: 80,
    height: 80,
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
  contentContainer: {
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
    marginBottom: 32,
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
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  childCard: {
    width: (width - 72) / 2,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  addChildCard: {
    width: (width - 72) / 2,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    resizeMode: 'cover',
  },
  uploadContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  uploadText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  childName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  childAge: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  addChildText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
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
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ChildProfileScreen; 