import * as Burnt from 'burnt';
import { useTheme } from 'src/theme';
import { sp } from 'src/theme/core/spacing';
import { View, StyleSheet } from 'react-native';
import { Form } from 'src/components/hook-form';
import { useForm, Controller } from 'react-hook-form';
import { Card, Stack, Button, Typography, Switch, Divider } from 'src/components/mui';

import type { JSX } from 'react';

// ----------------------------------------------------------------------

const NOTIFICATIONS = [
  {
    subheader: 'Activity',
    caption: 'Donec mi odio, faucibus at, scelerisque quis',
    items: [
      { id: 'activity_comments', label: 'Email me when someone comments on my article' },
      { id: 'activity_answers', label: 'Email me when someone answers on my form' },
      { id: 'activityFollows', label: 'Email me when someone follows me' },
    ],
  },
  {
    subheader: 'Application',
    caption: 'Donec mi odio, faucibus at, scelerisque quis',
    items: [
      { id: 'application_news', label: 'News and announcements' },
      { id: 'application_product', label: 'Weekly product updates' },
      { id: 'application_blog', label: 'Weekly blog digest' },
    ],
  },
];

// ----------------------------------------------------------------------

export function AccountNotifications(): JSX.Element {
  const { theme } = useTheme();

  const methods = useForm({
    defaultValues: { selected: ['activity_comments', 'application_product'] },
  });

  const {
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      Burnt.toast({ title: 'Update success!', preset: 'done' });
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const getSelected = (selectedItems: string[], item: string): string[] =>
    selectedItems.includes(item)
      ? selectedItems.filter((v) => v !== item)
      : [...selectedItems, item];

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ padding: sp(3) }}>
        {NOTIFICATIONS.map((group, gIndex) => (
          <View key={group.subheader}>
            {gIndex > 0 && <Divider sx={{ marginVertical: sp(3) }} />}

            <Typography variant="h6" sx={{ marginBottom: sp(0.5) }}>
              {group.subheader}
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: sp(2), color: 'text.secondary' }}>
              {group.caption}
            </Typography>

            <View
              style={[
                styles.groupBox,
                { backgroundColor: theme.palette.background.neutral, borderRadius: sp(1) },
              ]}
            >
              <Controller
                name="selected"
                control={control}
                render={({ field }) =>
                  group.items.map((item) => (
                    <View key={item.id} style={styles.row}>
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {item.label}
                      </Typography>
                      <Switch
                        checked={field.value.includes(item.id)}
                        onChange={() => field.onChange(getSelected(values.selected, item.id))}
                      />
                    </View>
                  )) as unknown as JSX.Element
                }
              />
            </View>
          </View>
        ))}

        <Stack sx={{ alignItems: 'flex-end', marginTop: sp(3) }}>
          <Button variant="contained" loading={isSubmitting} onClick={onSubmit}>
            Save changes
          </Button>
        </Stack>
      </Card>
    </Form>
  );
}

AccountNotifications.displayName = 'AccountNotifications';

const styles = StyleSheet.create({
  groupBox: {
    padding: sp(1.5),
    gap: sp(1),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: sp(0.5),
  },
});
