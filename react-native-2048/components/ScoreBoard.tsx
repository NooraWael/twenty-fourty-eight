import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ScoreBoardProps } from '../types/2048';


const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, bestScore, onReset }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>2048</Text>
        <Text style={styles.subtitle}>Join the numbers to get to 2048!</Text>
      </View>

      <View style={styles.scoresContainer}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
        
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>BEST</Text>
          <Text style={styles.scoreValue}>{bestScore}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={onReset}>
        <Text style={styles.buttonText}>New Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    marginBottom: 20,
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#776e65',
  },
  subtitle: {
    fontSize: 16,
    color: '#776e65',
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  scoreBox: {
    backgroundColor: '#bbada0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#eee4da',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scoreValue: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#8f7a66',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScoreBoard;