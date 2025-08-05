import { Redirect } from 'expo-router';

export default function GamificationIndex() {
  // Redirect to the badges screen by default
  return <Redirect href="/gamification/badges" />;
} 