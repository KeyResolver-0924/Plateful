import { Stack } from 'expo-router';
export default function GamificationLayout() {
  return (
    <Stack>
      <Stack.Screen name="badges" options={{ headerShown: false }} />
      <Stack.Screen name="leaderboard" options={{ headerShown: false }} />
      <Stack.Screen name="quests" options={{ headerShown: false }} />
    </Stack>
  );
} 