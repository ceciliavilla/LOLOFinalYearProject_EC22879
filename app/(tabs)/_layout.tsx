import { View, Image, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { ImageSourcePropType } from 'react-native';

const icons = {
  lolo: require('../../assets/icons/Home4.png'),
  settings: require('../../assets/icons/Settings2.png'),
};

const TabIcon = ({ icon, color, name, focused,}: { icon: ImageSourcePropType; color: string; name: string; focused: boolean; }) => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={icon}
        resizeMode="contain"
        style={{
          width: 100,
          height: 45,
          tintColor: color,
        }}
      />
      <Text
        style={{
          color,
          fontSize: 1,
          marginTop: 2,
          fontWeight: focused ? 'bold' : 'normal',
        }}
      >
        {name}
      </Text>
    </View>
  );
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#009D71', 
        tabBarShowLabel: false, 
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="ElderlyScreen"
        options={{
          title: 'ELDERLY',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.lolo}
              color={color}
              name=" "
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="ProfileScreen"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.settings}
              color={color}
              name="Profile"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

