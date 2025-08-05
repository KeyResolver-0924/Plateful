import { Stack } from 'expo-router';
export default function GamificationLayout() {
  return (
    <Stack>
      <Stack.Screen name="badges" options={{ headerShown: false }} />
    </Stack>
  );
} 