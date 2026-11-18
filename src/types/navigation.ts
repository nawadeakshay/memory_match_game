import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Difficulty } from '../hooks/useGameSettings';

export type RootStackParamList = {
  Home: undefined;
  Game: undefined;
  Win: {
    difficulty: Difficulty;
    moves: number;
    seconds: number;
    matchedPairs: number;
    totalPairs: number;
    newBestTime: boolean;
    newBestMoves: boolean;
  };
  TimeUp: {
    difficulty: Difficulty;
    moves: number;
    matchedPairs: number;
    totalPairs: number;
    timeLimitSec: number;
  };
  Settings: undefined;
};

export type RootStackScreenProps<RouteName extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  RouteName
>;
