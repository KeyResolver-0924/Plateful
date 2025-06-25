import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="setup" options={{ headerShown: false }} />
      <Stack.Screen name="food-selection" options={{ headerShown: false }} />
    </Stack>
  );
} 