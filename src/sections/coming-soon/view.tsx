/**
 * `ComingSoonView` — RN port of `src/sections/coming-soon/view.tsx`.
 *
 * Divergences from web:
 *  - `useCountdownDate` (from `minimal-shared/hooks`) inlined — minimal-shared
 *    is not (yet) installed on mobile and the hook is ~15 lines. If another
 *    consumer needs it, extract to `src/hooks/use-countdown-date.ts` then.
 *  - Countdown separators use plain Typography between Stacks (no `<Box sx>`
 *    divider prop in the RN adapter's Stack).
 *  - **Simplified input area:** the web version renders a fancy shadowed
 *    `TextField` with `InputAdornment` + inline Button and a row of social
 *    IconButtons. Mobile drops that entirely — a plain "Notify me" Button
 *    that no-ops is closer to what an MVP landing page needs, and the shadow
 *    recipe (`outlinedInputClasses.focused`) is MUI-specific. YAGNI.
 *  - Illustration substituted with Iconify glyph (see `error/not-found-view`).
 */

import { useTheme } from 'src/theme';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Iconify } from 'src/components/iconify';
import { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Stack, Typography } from 'src/components/mui';

import type { JSX } from 'react';

// ----------------------------------------------------------------------

const ILLUSTRATION_SIZE = 160;
const LAUNCH_DATE = new Date('2026-08-20T20:30:00');

type Countdown = { days: string; hours: string; minutes: string; seconds: string };

function computeCountdown(target: Date): Countdown {
  const diff = Math.max(0, target.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number): string => String(n).padStart(2, '0');
  return { days: pad(days), hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) };
}

function useCountdownDate(target: Date): Countdown {
  const [value, setValue] = useState<Countdown>(() => computeCountdown(target));
  const targetRef = useRef(target.getTime());
  targetRef.current = target.getTime();

  useEffect(() => {
    const id = setInterval(() => setValue(computeCountdown(new Date(targetRef.current))), 1000);
    return () => clearInterval(id);
  }, []);

  return value;
}

// ----------------------------------------------------------------------

export function ComingSoonView(): JSX.Element {
  const { theme } = useTheme();
  const router = useRouter();
  const countdown = useCountdownDate(LAUNCH_DATE);

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.palette.background.default }]}
      edges={['top', 'bottom']}
    >
      <View style={styles.content}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h3" align="center">
            Coming soon!
          </Typography>
          <Typography variant="body1" align="center" sx={{ color: theme.palette.text.secondary }}>
            We are currently working hard on this page!
          </Typography>
          <Iconify
            icon="solar:clock-circle-bold"
            width={ILLUSTRATION_SIZE}
            color={theme.palette.primary.main}
            style={styles.illustration}
          />
          <Stack direction="row" alignItems="flex-end" spacing={1}>
            <TimeBlock label="days" value={countdown.days} />
            <Typography variant="h3">:</Typography>
            <TimeBlock label="hours" value={countdown.hours} />
            <Typography variant="h3">:</Typography>
            <TimeBlock label="minutes" value={countdown.minutes} />
            <Typography variant="h3">:</Typography>
            <TimeBlock label="seconds" value={countdown.seconds} />
          </Stack>
          <Button variant="contained" size="large" onPress={() => router.replace('/')}>
            Go to home
          </Button>
        </Stack>
      </View>
    </SafeAreaView>
  );
}

ComingSoonView.displayName = 'ComingSoonView';

// ----------------------------------------------------------------------

type TimeBlockProps = { label: string; value: string };

function TimeBlock({ label, value }: TimeBlockProps): JSX.Element {
  const { theme } = useTheme();
  return (
    <View style={styles.timeBlock}>
      <Typography variant="h3" align="center">
        {value}
      </Typography>
      <Typography variant="body2" align="center" sx={{ color: theme.palette.text.secondary }}>
        {label}
      </Typography>
    </View>
  );
}

// ----------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  illustration: {
    marginVertical: 24,
  },
  timeBlock: {
    minWidth: 56,
    alignItems: 'center',
  },
});
