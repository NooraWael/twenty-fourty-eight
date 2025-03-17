import { Animated } from "react-native";

export interface TileProps {
  value: number;
  position: Animated.ValueXY;
  size: number;
  margin: number;
  isNew?: boolean;
  mergedFrom?: boolean;
  zIndex?: number;
}

export interface ScoreBoardProps {
  score: number;
  bestScore: number;
  onReset: () => void;
}

export interface GameOverlayProps {
  visible: boolean;
  won: boolean;
  score: number;
  onRestart: () => void;
}