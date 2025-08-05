import { Redirect } from 'expo-router';

export default function ReportingIndex() {
  // Redirect to the meals screen by default
  return <Redirect href="/reporting/report" />;
} 