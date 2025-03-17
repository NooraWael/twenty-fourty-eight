/**
 * Formats a score value with thousands separators
 * @param score The score to format
 * @returns Formatted score as a string
 */
export const formatScore = (score: number): string => {
    return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  /**
   * Get color based on tile value
   * @param value The tile value (2, 4, 8, etc.)
   * @returns Hex color code for the tile background
   */
  export const getTileColor = (value: number): string => {
    const colors: Record<number, string> = {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
    };
    
    return colors[value] || '#3c3a32'; // Default for very high values
  };
  
  /**
   * Get text color based on tile value
   * @param value The tile value (2, 4, 8, etc.)
   * @returns Hex color code for the text
   */
  export const getTextColor = (value: number): string => {
    // Values 2 and 4 use dark text, all others use light text
    return value <= 4 ? '#776e65' : '#ffffff';
  };
  
  /**
   * Calculate appropriate font size based on the tile value
   * @param value The tile value
   * @param baseSize The base size of the tile
   * @returns Font size as a number
   */
  export const getTileFontSize = (value: number, baseSize: number): number => {
    if (value < 100) return baseSize * 0.5; // 2, 4, 8, 16, 32, 64
    if (value < 1000) return baseSize * 0.4; // 128, 256, 512
    return baseSize * 0.3; // 1024, 2048, etc.
  };
  
  /**
   * Format time duration in seconds to mm:ss format
   * @param seconds Number of seconds
   * @returns Formatted time string (e.g., "02:45")
   */
  export const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  
  /**
   * Calculate grade or rating based on score
   * @param score The player's score
   * @returns A grade or rating as a string
   */
  export const calculateRating = (score: number): string => {
    if (score >= 20000) return 'Master';
    if (score >= 10000) return 'Expert';
    if (score >= 5000) return 'Advanced';
    if (score >= 2000) return 'Intermediate';
    if (score >= 1000) return 'Novice';
    return 'Beginner';
  };
  
  /**
   * Format a date as a readable string
   * @param date Date object or timestamp
   * @returns Formatted date string (e.g., "Apr 15, 2023")
   */
  export const formatDate = (date: Date | number): string => {
    const dateObj = typeof date === 'number' ? new Date(date) : date;
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };