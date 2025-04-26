import React, { useRef } from 'react';
import { View, Text, FlatList, Animated, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import styles from "./styles/stylecarro";

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.6;
const SPACING = 10;

interface ConnectedUser {
  id: string;
  name: string;
  lastName?: string;
}

interface ConnectedUserCarouselProps {
  data: ConnectedUser[];
  onPrimaryAction?: (id: string) => void;
  onSecondaryAction?: (id: string) => void;
  onTertiaryAction?: (id: string) => void;
  onFourthAction?: (id: string) => void;
  onFifthAction?: (id: string) => void;
  onDisconnect?: (id: string) => void;
  primaryLabel?: string;
  secondaryLabel?: string;
  tertiaryLabel?: string;
  fourthLabel?: string;
  fifthLabel?: string;
  showDisconnect?: boolean;
}

const ConnectedUserCarousel: React.FC<ConnectedUserCarouselProps> = ({
  data,
  onPrimaryAction,
  onSecondaryAction,
  onTertiaryAction,
  onFourthAction,
  onFifthAction,
  onDisconnect,
  primaryLabel = "Primary",
  secondaryLabel = "Secondary",
  tertiaryLabel = "Tertiary",
  fourthLabel = "Fourth",
  fifthLabel = "Fifth",
  showDisconnect = true,
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  const renderItem = ({ item, index }: { item: ConnectedUser; index: number }) => {
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

        {onPrimaryAction && (
          <TouchableOpacity style={styles.button} onPress={() => onPrimaryAction(item.id)}>
            <Text style={styles.buttonText}>{primaryLabel}</Text>
          </TouchableOpacity>
        )}

        {onSecondaryAction && (
          <TouchableOpacity style={styles.button} onPress={() => onSecondaryAction(item.id)}>
            <Text style={styles.buttonText}>{secondaryLabel}</Text>
          </TouchableOpacity>
        )}

        {onTertiaryAction && (
          <TouchableOpacity style={styles.button} onPress={() => onTertiaryAction(item.id)}>
            <Text style={styles.buttonText}>{tertiaryLabel}</Text>
          </TouchableOpacity>
        )}

        {onFourthAction && (
          <TouchableOpacity style={styles.button} onPress={() => onFourthAction(item.id)}>
            <Text style={styles.buttonText}>{fourthLabel}</Text>
          </TouchableOpacity>
        )}

        {onFifthAction && (
          <TouchableOpacity style={styles.button} onPress={() => onFifthAction(item.id)}>
            <Text style={styles.buttonText}>{fifthLabel}</Text>
          </TouchableOpacity>
        )}

        {showDisconnect && (
          <TouchableOpacity
            style={styles.disconnectButton}
            onPress={() => {
              Alert.alert(
                "Confirm Disconnect",
                `Are you sure you want to disconnect from ${item.name}?`,
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Disconnect", style: "destructive", onPress: () => onDisconnect?.(item.id) },
                ]
              );
            }}
          >
            <Text style={styles.disconnectText}>X</Text>
          </TouchableOpacity>
        )}
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

export default ConnectedUserCarousel;
