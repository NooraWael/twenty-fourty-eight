import React from 'react';
import { StyleSheet, View, Dimensions, PanResponder, PanResponderInstance } from 'react-native';
import Tile from './Tile';
import { TileData } from '../hooks/board';

const { width } = Dimensions.get('window');

// Improved grid size calculations
const GRID_CONTAINER_SIZE = width * 0.9; // Keep at 90% of screen width
const GRID_SIZE = 4; // Confirm we're using 4x4
const GRID_PADDING = 10; // The padding inside the container
const CELL_MARGIN = 5; // Space between cells

// Correctly calculate cell size based on available space
// This is the key calculation that ensures proper alignment
const CELL_SIZE = (GRID_CONTAINER_SIZE - (2 * GRID_PADDING) - ((GRID_SIZE + 1) * CELL_MARGIN * 2)) / GRID_SIZE;

export interface TileGridProps {
  tiles: TileData[];
  onSwipe: (direction: 'up' | 'right' | 'down' | 'left') => void;
}

const TileGrid: React.FC<TileGridProps> = ({ tiles, onSwipe }) => {
  // PanResponder setup (keep as is)
  const panResponder: PanResponderInstance = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      const { dx, dy } = gestureState;
      return Math.abs(dx) > 10 || Math.abs(dy) > 10;
    },
    onPanResponderRelease: (_, gestureState) => {
      const { dx, dy } = gestureState;
      
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
          onSwipe('right');
        } else {
          onSwipe('left');
        }
      } else {
        if (dy > 0) {
          onSwipe('down');
        } else {
          onSwipe('up');
        }
      }
    },
  });

  // Helper function to calculate position for a specific grid cell
  // This ensures consistency between the grid cells and tile positions
  const getPositionForCell = (row: number, col: number) => {
    return {
      top: GRID_PADDING + (row * (CELL_SIZE + CELL_MARGIN * 2)) + CELL_MARGIN,
      left: GRID_PADDING + (col * (CELL_SIZE + CELL_MARGIN * 2)) + CELL_MARGIN
    };
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Grid background cells - rendered with absolute positioning */}
      <View style={styles.grid}>
        {Array.from({ length: GRID_SIZE }).map((_, row) => (
          Array.from({ length: GRID_SIZE }).map((_, col) => {
            const { top, left } = getPositionForCell(row, col);
            return (
              <View 
                key={`cell-${row}-${col}`} 
                style={[
                  styles.cell,
                  {
                    position: 'absolute',
                    top,
                    left,
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                  }
                ]} 
              />
            );
          })
        ))}
      </View>

      {/* Render the actual tiles */}
      {tiles.map((tile) => (
        <Tile
          key={`tile-${tile.id}`}
          value={tile.value}
          position={tile.position}
          size={CELL_SIZE}
          margin={CELL_MARGIN}
          isNew={tile.isNew}
          mergedFrom={tile.mergedFrom}
          zIndex={tile.mergedFrom ? 2 : 1}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: GRID_CONTAINER_SIZE,
    height: GRID_CONTAINER_SIZE,
    backgroundColor: '#bbada0',
    borderRadius: 6,
    padding: GRID_PADDING,
    position: 'relative',
  },
  grid: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  cell: {
    backgroundColor: 'rgba(238, 228, 218, 0.35)',
    borderRadius: 6,
  },
});

// Export constants so they can be imported in other files (like useGameBoard)
export { GRID_SIZE, CELL_SIZE, CELL_MARGIN, GRID_PADDING };

export default TileGrid;