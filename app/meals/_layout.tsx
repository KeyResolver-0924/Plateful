import { Stack } from 'expo-router';

export default function MealsLayout() {
  return (
    <Stack>
      <Stack.Screen name="history" options={{ headerShown: false }} />
      <Stack.Screen name="tracking" options={{ headerShown: false }} />
      <Stack.Screen name="logging" options={{ headerShown: false }} />
    </Stack>
  );
} 