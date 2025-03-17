import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { GameOverlayProps } from '../types/2048';


const GameOverlay: React.FC<GameOverlayProps> = ({ visible, won, score, onRestart }) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.messageBox}>
        <Text style={styles.messageTitle}>
          {won ? 'You Win!' : 'Game Over!'}
        </Text>
        
        <Text style={styles.messageScore}>
          Score: {score}
        </Text>
        
        <TouchableOpacity style={styles.button} onPress={onRestart}>
          <Text style={styles.buttonText}>
            {won ? 'Play Again' : 'Try Again'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(238, 228, 218, 0.73)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  messageBox: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  messageTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#776e65',
    marginBottom: 10,
  },
  messageScore: {
    fontSize: 20,
    color: '#776e65',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8f7a66',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GameOverlay;