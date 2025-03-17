# twenty-fourty-eight
 
# 2048 Game - React Native

A mobile implementation of the popular 2048 puzzle game built with React Native, TypeScript, and Expo.

## About the Game

2048 is a single-player sliding block puzzle game. The objective is to slide numbered tiles on a grid to combine them and create a tile with the number 2048.

## Features

- 4×4 grid game board
- Smooth animations for tile movements
- Touch gesture controls (swipe up, down, left, right)
- Score tracking with best score persistence
- Game over and win detection
- Responsive design for various mobile screens

## Technologies Used

- React Native
- TypeScript
- Expo
- React Hooks for state management
- React Native's Animated API for smooth animations
- Expo Linear Gradient for polished UI

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or newer)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

## Installation

1. Clone this repository
   ```bash
   git clone https://github.com/noorawael/twenty-fourty-eight
   cd react-native-2048
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npx expo start
   ```

4. Open the app on your device using the Expo Go app or on an emulator


## Game Mechanics

- Each move (swipe) can be in one of four directions: up, down, left, or right
- All tiles slide in the chosen direction until they hit the wall or another tile
- When two tiles with the same number collide, they merge into one tile with the sum of their values
- After each move, a new tile (2 or 4) appears in a random empty spot
- The game is won when a 2048 tile is created
- The game ends when no more moves are possible (the board is full and no adjacent tiles can merge)

## Development Process

This 2048 implementation is built step-by-step:

1. Set up the basic UI structure with the game board, score displays, and control buttons
2. Define the game state and data structures needed to represent the board and tiles
3. Implement tile creation and board initialization logic
4. Create the core movement mechanics for sliding tiles in each direction
5. Add tile merging logic with score updates
6. Implement game over and win detection
7. Add animations for smooth tile movements
8. Polish the UI with styled components and responsive design

## Code Quality

This project uses ESLint and Prettier to maintain code quality and consistent formatting:
- ESLint enforces best practices and catches potential issues
- Prettier ensures consistent code formatting


## Acknowledgments

- Original 2048 game by Gabriele Cirulli
- React Native and Expo teams for the tools

## Future Enhancements

Some ideas for future improvements:
- Add undo functionality
- Implement local storage for saving game state
- Create settings for customizing colors and grid size
- Add sound effects and haptic feedback
- Implement a leaderboard feature