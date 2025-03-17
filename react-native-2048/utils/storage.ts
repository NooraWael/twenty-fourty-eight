import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  BEST_SCORE: '@Game2048:bestScore',
  GAME_STATE: '@Game2048:gameState',
};

/**
 * Saves the best score to AsyncStorage
 * @param score The score to save
 */
export const saveBestScore = async (score: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BEST_SCORE, score.toString());
  } catch (error) {
    console.error('Error saving best score:', error);
  }
};

/**
 * Retrieves the best score from AsyncStorage
 * @returns The best score, or 0 if not found
 */
export const getBestScore = async (): Promise<number> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.BEST_SCORE);
    return value ? parseInt(value, 10) : 0;
  } catch (error) {
    console.error('Error retrieving best score:', error);
    return 0;
  }
};

/**
 * Interface for the game state that will be saved
 */
export interface SavedGameState {
  grid: (number | null)[][];
  score: number;
  bestScore: number;
}

/**
 * Saves the current game state to AsyncStorage
 * @param gameState The game state to save
 */
export const saveGameState = async (gameState: SavedGameState): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(gameState);
    await AsyncStorage.setItem(STORAGE_KEYS.GAME_STATE, jsonValue);
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};

/**
 * Retrieves the saved game state from AsyncStorage
 * @returns The saved game state, or null if not found
 */
export const getSavedGameState = async (): Promise<SavedGameState | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.GAME_STATE);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving game state:', error);
    return null;
  }
};

/**
 * Clears all game data from AsyncStorage
 */
export const clearGameData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.BEST_SCORE,
      STORAGE_KEYS.GAME_STATE,
    ]);
  } catch (error) {
    console.error('Error clearing game data:', error);
  }
};

/**
 * Saves a specific value to AsyncStorage with a custom key
 * This is a generic utility function to save any data
 * @param key The storage key
 * @param value The value to save
 */
export const saveData = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
  }
};

/**
 * Retrieves a value from AsyncStorage by key
 * This is a generic utility function to retrieve any data
 * @param key The storage key
 * @returns The stored value, or null if not found
 */
export const getData = async (key: string): Promise<any> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) {
      return null;
    }
    
    // Try to parse as JSON, if it fails, return the raw string
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    console.error(`Error retrieving data for key ${key}:`, error);
    return null;
  }
};

/**
 * Removes a specific item from AsyncStorage
 * @param key The storage key to remove
 */
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
  }
};