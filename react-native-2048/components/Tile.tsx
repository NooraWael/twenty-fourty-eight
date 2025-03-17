import React from 'react';
import { StyleSheet, Text, Animated, ViewStyle, TextStyle } from 'react-native';
import { getTileColor, getTextColor, getTileFontSize } from '../utils/formatting';
import { TileProps } from '../types/2048';

const Tile: React.FC<TileProps> = ({
  value,
  position,
  size,
  margin,
  isNew = false,
  mergedFrom = false,
  zIndex = 1,
}) => {
  // Define the tile styles
  const tileStyle: ViewStyle = {
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: getTileColor(value),
    zIndex: zIndex,
  };

  // Define the text styles
  const textStyle: TextStyle = {
    fontSize: getTileFontSize(value, size),
    fontWeight: 'bold',
    color: getTextColor(value),
  };

  return (
    <Animated.View
      style={[
        tileStyle,
        {
          transform: [
            { translateX: position.x },
            { translateY: position.y },
          ],
        },
        isNew && styles.newTile,
        mergedFrom && styles.mergedTile,
      ]}
    >
      <Text style={textStyle}>{value}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  newTile: {
    opacity: 0.8,
    // Later
  },
  mergedTile: {
    // Later
  },
});

export default Tile;