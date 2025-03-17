import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TileGrid from './components/TileGrid';
import ScoreBoard from './components/ScoreBoard';
import GameOverlay from './components/GameOverlay';
import useGameBoard from './hooks/board';

// Import utility functions
import { getBestScore, saveBestScore } from './utils/storage';

export default function App() {
  // State to track if we're still loading saved data
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize game logic with our custom hook
  const {
    tiles,
    score,
    bestScore,
    gameOver,
    won,
    handleSwipe,
    resetGame
  } = useGameBoard();

  // When the app first loads, retrieve the best score from storage
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Load best score from AsyncStorage
        const savedBestScore = await getBestScore();
        // TODO RETRIEVE CURRENT GAME DATA 
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load game data:', error);
        setIsLoading(false);
      }
    };

    loadSavedData();
  }, []);

  // Whenever the best score changes, save it to storage
  useEffect(() => {
    if (bestScore > 0) {
      saveBestScore(bestScore);
    }
  }, [bestScore]);

  // Function to pass to the reset button
  const handleReset = () => {
    resetGame();
  };

  // Show a loading screen while we fetch saved data
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Main app UI
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#faf8ef" />
      
      <LinearGradient
        colors={['#faf8ef', '#eee4da']}
        style={styles.background}
      >
        <View style={styles.content}>
          {/* Score display and new game button */}
          <ScoreBoard
            score={score}
            bestScore={bestScore}
            onReset={handleReset}
          />
          
          {/* Game instructions */}
          <View style={styles.instructions}>
            <Text style={styles.instructionsText}>
              Swipe to move tiles. Combine matching numbers to reach 2048!
            </Text>
          </View>
          
          {/* Game board */}
          <View style={styles.boardContainer}>
            <TileGrid 
              tiles={tiles} 
              onSwipe={handleSwipe} 
            />
            
            {/* Game over/win overlay */}
            <GameOverlay
              visible={gameOver || won}
              won={won}
              score={score}
              onRestart={handleReset}
            />
          </View>
          
          {/* Footer with credit or tips */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Swipe in any direction to start playing!
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#faf8ef',
  },
  loadingText: {
    fontSize: 20,
    color: '#776e65',
  },
  boardContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  instructions: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  instructionsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#776e65',
  },
  footer: {
    padding: 10,
    marginTop: 10,
  },
  footerText: {
    color: '#776e65',
    fontSize: 14,
    textAlign: 'center',
  },
});