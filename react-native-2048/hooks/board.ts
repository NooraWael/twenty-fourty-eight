import { useState, useEffect, useRef, useCallback } from 'react';
import { Animated } from 'react-native';
import { GRID_SIZE, CELL_SIZE, CELL_MARGIN, GRID_PADDING } from '../components/TileGrid';
import { getBestScore, saveBestScore } from '../utils/storage';

// Define the structure of a tile
export interface TileData {
  id: number;
  value: number;
  row: number;
  col: number;
  mergedFrom: boolean;
  isNew: boolean;
  position: Animated.ValueXY;
}

// Define the structure of the game state
interface GameState {
  grid: (number | null)[][];
  tiles: TileData[];
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
}

// Define the return type of our custom hook
interface GameBoardHook {
  tiles: TileData[];
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
  handleSwipe: (direction: 'up' | 'right' | 'down' | 'left') => void;
  resetGame: () => void;
}

/**
 * Custom hook that manages the game board logic for 2048
 */
const useGameBoard = (): GameBoardHook => {
  // Track the next available ID for tiles
  const nextIdRef = useRef<number>(0);
  
  // Initialize game state
  const [gameState, setGameState] = useState<GameState>({
    grid: Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)),
    tiles: [],
    score: 0,
    bestScore: 0,
    gameOver: false,
    won: false,
  });

  //get best score from storage
  useEffect(() => {
    const loadBestScore = async () => {
      try {
        const savedBestScore = await getBestScore();
        if (savedBestScore > 0) {
          // Update only the bestScore in the game state
          setGameState(prevState => ({
            ...prevState,
            bestScore: savedBestScore
          }));
        }
      } catch (error) {
        console.error('Failed to load best score:', error);
      }
    };

    loadBestScore();
  }, []);

  /**
   * Add a random tile to the grid
   * 90% chance for a 2, 10% chance for a 4
   */
  const addRandomTile = useCallback((grid: (number | null)[][], tiles: TileData[]) => {
    // Find all empty cells
    const emptyCells: {row: number, col: number}[] = [];
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col] === null) {
          emptyCells.push({ row, col });
        }
      }
    }
    
    // If there are empty cells
    if (emptyCells.length > 0) {
      // Choose a random empty cell
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      
      // Decide the value (90% chance for 2, 10% chance for 4)
      const value = Math.random() < 0.9 ? 2 : 4;
      
      // Update the grid
      grid[row][col] = value;
      
      // Create a new tile
      const newTile: TileData = {
        id: nextIdRef.current++,
        value,
        row,
        col,
        mergedFrom: false,
        isNew: true,
        position: new Animated.ValueXY({
          x: GRID_PADDING + (col * (CELL_SIZE + CELL_MARGIN * 2)) + CELL_MARGIN,
          y: GRID_PADDING + (row * (CELL_SIZE + CELL_MARGIN * 2)) + CELL_MARGIN
        }),
      };
      
      // Add the new tile to the tiles array
      tiles.push(newTile);
    }
  }, []);

  /**
   * Initialize or reset the game
   */
  const resetGame = useCallback(() => {
    // Reset the ID counter
    nextIdRef.current = 0;
    
    // Create a new empty grid
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    const newTiles: TileData[] = [];
    
    // Add 2-3 initial tiles
    const initialTilesCount = Math.random() < 0.5 ? 2 : 3;
    for (let i = 0; i < initialTilesCount; i++) {
      addRandomTile(newGrid, newTiles);
    }
    
    // Update the game state
    setGameState(prev => ({
      grid: newGrid,
      tiles: newTiles,
      score: 0,
      bestScore: prev.bestScore, // Preserve the best score
      gameOver: false,
      won: false,
    }));
  }, [addRandomTile]);

  /**
   * Check if the game is over (no more valid moves)
   */
  const isGameOver = useCallback((grid: (number | null)[][]) => {
    // Check if grid is full
    let hasEmptyCell = false;
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col] === null) {
          hasEmptyCell = true;
          break;
        }
      }
      if (hasEmptyCell) break;
    }
    
    // If grid has empty cells, game is not over
    if (hasEmptyCell) return false;
    
    // Check if any adjacent cells have the same value
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const currentValue = grid[row][col];
        
        // Check right
        if (col < GRID_SIZE - 1 && grid[row][col + 1] === currentValue) return false;
        
        // Check down
        if (row < GRID_SIZE - 1 && grid[row + 1][col] === currentValue) return false;
      }
    }
    
    // No empty cells and no possible merges
    return true;
  }, []);

  /**
   * Determine the traversal order based on direction
   * This is important to ensure tiles move correctly
   */
  const getTraversals = useCallback((direction: 'up' | 'right' | 'down' | 'left') => {
    const traversals = {
      row: Array.from({ length: GRID_SIZE }, (_, i) => i),
      col: Array.from({ length: GRID_SIZE }, (_, i) => i),
    };
    
    // Process tiles from the correct direction
    if (direction === 'right') traversals.col = traversals.col.reverse();
    if (direction === 'down') traversals.row = traversals.row.reverse();
    
    return traversals;
  }, []);

  /**
   * Find the farthest position a tile can move to
   */
  const findFarthestPosition = useCallback((
    grid: (number | null)[][], 
    row: number, 
    col: number, 
    direction: 'up' | 'right' | 'down' | 'left'
  ) => {
    let farthestRow = row;
    let farthestCol = col;
    let nextRow: number | null = null;
    let nextCol: number | null = null;
    
    // Define direction vectors
    const vectors = {
      up: { row: -1, col: 0 },
      right: { row: 0, col: 1 },
      down: { row: 1, col: 0 },
      left: { row: 0, col: -1 },
    };
    
    const vector = vectors[direction];
    
    // Find the farthest cell and the next cell
    let currentRow = row + vector.row;
    let currentCol = col + vector.col;
    
    // Keep moving in the direction until we hit a non-empty cell or the edge
    while (
      currentRow >= 0 && currentRow < GRID_SIZE &&
      currentCol >= 0 && currentCol < GRID_SIZE &&
      grid[currentRow][currentCol] === null
    ) {
      farthestRow = currentRow;
      farthestCol = currentCol;
      
      currentRow += vector.row;
      currentCol += vector.col;
    }
    
    // If we didn't hit the edge, there's a next cell
    if (
      currentRow >= 0 && currentRow < GRID_SIZE &&
      currentCol >= 0 && currentCol < GRID_SIZE
    ) {
      nextRow = currentRow;
      nextCol = currentCol;
    }
    
    return { farthestRow, farthestCol, nextRow, nextCol };
  }, []);

  /**
   * Move tiles in the specified direction
   */
  const handleSwipe = useCallback(async (direction: 'up' | 'right' | 'down' | 'left') => {
    // Don't process moves if game is over or won
    if (gameState.gameOver || gameState.won) return;
    
    // Clone current game state to avoid direct mutation
    const newGrid = gameState.grid.map(row => [...row]);
    const newTiles = gameState.tiles.map(tile => ({
      ...tile,
      mergedFrom: false,
      isNew: false
    }));
    
    let moved = false;
    let score = gameState.score;
    
    // Process tiles in the correct order based on direction
    const traversals = getTraversals(direction);
    
    traversals.row.forEach(row => {
      traversals.col.forEach(col => {
        // Skip empty cells
        if (newGrid[row][col] === null) return;
        
        const tileValue = newGrid[row][col]!;
        const tileIndex = newTiles.findIndex(t => t.row === row && t.col === col);
        
        // Find the farthest position and potential merge
        const { farthestRow, farthestCol, nextRow, nextCol } = findFarthestPosition(
          newGrid, row, col, direction
        );
        
        // Check if we can merge with the next tile
        if (nextRow !== null && nextCol !== null && newGrid[nextRow][nextCol] === tileValue) {
          // Merge tiles
          const mergedValue = tileValue * 2;
          newGrid[nextRow][nextCol] = mergedValue;
          newGrid[row][col] = null;
          
          // Update score
          score += mergedValue;
          
          // Check if won (reached 2048)
          if (mergedValue === 2048) {
            setGameState(prev => ({ ...prev, won: true }));
          }
          
          if (tileIndex !== -1) {
            const nextTileIndex = newTiles.findIndex(t => t.row === nextRow && t.col === nextCol);
            
            if (nextTileIndex !== -1) {
              // Update merged tile
              newTiles[nextTileIndex].value = mergedValue;
              newTiles[nextTileIndex].mergedFrom = true;
              
              // Animate tile movement
              Animated.spring(newTiles[tileIndex].position, {
                toValue: {
                  x: GRID_PADDING + (nextCol * (CELL_SIZE + CELL_MARGIN * 2)) + CELL_MARGIN,
                  y: GRID_PADDING + (nextRow * (CELL_SIZE + CELL_MARGIN * 2)) + CELL_MARGIN
                },
                useNativeDriver: false,
                friction: 6,
              }).start();
              
              // Schedule removal of the source tile after animation
              setTimeout(() => {
                setGameState(prev => ({
                  ...prev,
                  tiles: prev.tiles.filter(t => t.id !== newTiles[tileIndex].id)
                }));
              }, 100);
            }
          }
          
          moved = true;
        } 
        // Move tile if no merge but position changed
        else if (farthestRow !== row || farthestCol !== col) {
          newGrid[farthestRow][farthestCol] = tileValue;
          newGrid[row][col] = null;
          
          if (tileIndex !== -1) {
            // Update tile position
            newTiles[tileIndex].row = farthestRow;
            newTiles[tileIndex].col = farthestCol;
            
            // Animate tile movement
            Animated.spring(newTiles[tileIndex].position, {
              toValue: {
                x: GRID_PADDING + (farthestCol * (CELL_SIZE + CELL_MARGIN * 2)) + CELL_MARGIN,
                y: GRID_PADDING + (farthestRow * (CELL_SIZE + CELL_MARGIN * 2)) + CELL_MARGIN
              },
              useNativeDriver: false,
              friction: 6,
            }).start();
            
            moved = true;
          }
        }
      });
    });
    
    if (moved) {
      // Add a new random tile
      addRandomTile(newGrid, newTiles);
      
      // Check if game is over
      const gameOver = isGameOver(newGrid);
      
      // Update best score
      const bestScore = Math.max(gameState.bestScore, score);

      await saveBestScore(bestScore);
      
      // Update game state
      setGameState({
        grid: newGrid,
        tiles: newTiles,
        score,
        bestScore,
        gameOver,
        won: gameState.won,
      });
    }
  }, [gameState, getTraversals, findFarthestPosition, addRandomTile, isGameOver]);

  // Initialize the game on first render
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  return {
    tiles: gameState.tiles,
    score: gameState.score,
    bestScore: gameState.bestScore,
    gameOver: gameState.gameOver,
    won: gameState.won,
    handleSwipe,
    resetGame,
  };
};

export default useGameBoard;