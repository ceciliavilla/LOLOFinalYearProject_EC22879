import React, { useRef } from 'react';
import { View, Text, FlatList, Animated, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import styles from "./styles/stylecarro";


const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.6;
const SPACING = 10;

const ConnectedElderlyCarousel = ({ data }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <Text style={styles.name}>{item.name} {item.lastName}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push({ pathname: '/RemindersScreen', params: { elderlyId: item.id } })}
        >
          <Text style={styles.buttonText}>Add Reminders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push({ pathname: '/Calendar2', params: { elderlyId: item.id } })}
        >
          <Text style={styles.buttonText}>Calendar</Text>
        </TouchableOpacity>
      </Animated.View>
    );
    
  };
  

  return (
    <Animated.FlatList
      data={data}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={ITEM_WIDTH + SPACING}
      decelerationRate="fast"
      bounces={true}
      contentContainerStyle={{ paddingHorizontal: SPACING }}
      renderItem={renderItem}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
    />
  );
};



export default ConnectedElderlyCarousel;
