import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

import type { JSX } from 'react';

export default function NotFoundScreen(): JSX.Element {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={styles.root}>
        <Text style={styles.title}>This screen does not exist.</Text>
        <Link href="/" style={styles.link}>
          Go to home
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    marginTop: 12,
    paddingVertical: 8,
  },
});
