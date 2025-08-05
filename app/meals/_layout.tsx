import { Stack } from 'expo-router';

export default function MealsLayout() {
  return (
    <Stack>
      <Stack.Screen name="logging" options={{ headerShown: false }} />
    </Stack>
  );
} 