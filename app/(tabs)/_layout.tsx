import { View, Image, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { ImageSourcePropType } from 'react-native';
import { useEffect, useState } from 'react';
import { auth, db } from '../../firebaseConfig'; 
import { doc, getDoc } from 'firebase/firestore';
import styleslayout from '../styles/styleslayout'; // asegúrate de que la ruta sea correcta

const icons = {
  lolo: require('../../assets/icons/Home4.png'),
  settings: require('../../assets/icons/Settings2.png'),
  chat: require('../../assets/icons/ChatLogo.png'),
};

const TabIcon = ({
  icon,
  color,
  name,
  focused,
}: {
  icon: ImageSourcePropType;
  color: string;
  name: string;
  focused: boolean;
}) => (
  <View style={styleslayout.iconContainer}>
    <Image
      source={icon}
      resizeMode="contain"
      style={[styleslayout.iconImage, { tintColor: color }]}
    />
    <Text
      style={[
        styleslayout.iconText,
        { color, fontWeight: focused ? 'bold' : 'normal' },
      ]}
    >
      {name}
    </Text>
  </View>
);

export default function TabsLayout() {
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserType = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const userDoc = await getDoc(doc(db, 'users', uid));
      const data = userDoc.data();
      console.log('userType:', data?.userType);
      setUserType(data?.userType);
    };

    fetchUserType();
  }, []);

  if (!userType) {
    return (
      <View style={styleslayout.loadingContainer}>
        <Text>Cargando usuario...</Text>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#009D71',
        tabBarShowLabel: false,
        tabBarStyle: styleslayout.tabBar,
      }}
    >
      <Tabs.Screen
        name="ElderlyScreen"
        options={{
          href: userType === 'Elderly' ? undefined : null,
          title: 'ELDERLY',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <TabIcon icon={icons.lolo} color={color} name=" " focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="FamilyScreen"
        options={{
          href: userType === 'Family' ? undefined : null,
          title: 'FAMILY',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <TabIcon icon={icons.lolo} color={color} name=" " focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="HealthcareScreen"
        options={{
          href: userType === 'Healthcare' ? undefined : null,
          title: 'HEALTHCARE',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <TabIcon icon={icons.lolo} color={color} name=" " focused={focused} />
          ),
        }}
      />
        <Tabs.Screen
        name="CheckPosts"
        options={{
          href: userType === 'Elderly'  ? undefined : null,
          title: 'Posts',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <TabIcon icon={icons.chat} color={color} name="Posts" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="ProfileScreen"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <TabIcon icon={icons.settings} color={color} name="Profile" focused={focused} />
          ),
        }}
      />
      
    </Tabs>
    
  );
}
