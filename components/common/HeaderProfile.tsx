import React, { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View
} from 'react-native';

interface UserData {
  name: string;
  childName: string;
  avatar: ImageSourcePropType;
  childAge: string;
  streak: number;
  level: number;
  xp: number;
  nextLevelXp: number;
}

const HeaderProfile: React.FC = () => {

  const [userData, setUserData] = useState<UserData>({
    name: 'Laurentia Claris',
    childName: 'Emma',
    avatar: require('../../assets/images/avatars/boy.png'),
    childAge: '2',
    streak: 7,
    level: 3,
    xp: 1250,
    nextLevelXp: 2000
  });

  return (
    <View style={styles.headerProfile}>
      <View style={styles.profileInfo}>
        <View style={styles.profileAvatar}>
          <Image source={userData.avatar} style={styles.avatarImage} />
        </View>
        <View>
          <Text style={styles.profileName}>{userData.name}</Text>
            <Text style={styles.profileStatus}>
              <Image source={require('../../assets/images/icons/premium.svg')} style={styles.premiumIcon} />
              Premium
            </Text>
        </View>
      </View>
        <View style={styles.chargeIconContainer}>
          <Image source={require('../../assets/images/icons/charge.svg')} style={styles.chargeIcon} />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerProfile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFE0B2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  profileStatus: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  premiumIcon: {
    width: 19,
    height: 19,
    marginRight: 5,
    marginTop: 5,
    marginBottom: -5,
  },
  chargeIconContainer: {
    width: 110,
    height: 38,
    justifyContent: 'center',
  },
  chargeIcon: {
    width: 110,
    height: 38,
    justifyContent: 'center',
  },
});

export default HeaderProfile; 