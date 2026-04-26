import { sp } from 'src/theme/core/spacing';
import { fDate } from 'src/utils/format-time';
import { View, StyleSheet } from 'react-native';
import { Iconify } from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { fCurrency } from 'src/utils/format-number';
import { Card, Stack, Button, Divider, Typography } from 'src/components/mui';

import type { JSX } from 'react';
import type { IUserAccountBillingHistory } from 'src/types/user';

// ----------------------------------------------------------------------

type Props = {
  invoices: IUserAccountBillingHistory[];
};

export function AccountBillingHistory({ invoices }: Props): JSX.Element {
  const showMore = useBoolean();

  const visible = showMore.value ? invoices : invoices.slice(0, 8);

  return (
    <Card>
      <Typography variant="h6" sx={{ padding: sp(3), paddingBottom: 0 }}>
        Invoice history
      </Typography>

      <Stack sx={{ paddingHorizontal: sp(3), paddingTop: sp(3), gap: sp(1.5) }}>
        {visible.map((invoice) => (
          <View key={invoice.id} style={styles.row}>
            <View style={styles.textBlock}>
              <Typography variant="body2">{invoice.invoiceNumber}</Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled', marginTop: sp(0.5) }}>
                {fDate(invoice.createdAt)}
              </Typography>
            </View>

            <Typography variant="body2" sx={{ marginRight: sp(2) }}>
              {fCurrency(invoice.price)}
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: 'primary.main', textDecorationLine: 'underline' }}
            >
              PDF
            </Typography>
          </View>
        ))}

        <Divider sx={{ borderStyle: 'dashed' }} />
      </Stack>

      <Stack sx={{ padding: sp(2) }}>
        <Button
          size="small"
          color="inherit"
          startIcon={() => (
            <Iconify
              width={16}
              icon={showMore.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            />
          )}
          onClick={showMore.onToggle}
        >
          {showMore.value ? 'Show less' : 'Show more'}
        </Button>
      </Stack>
    </Card>
  );
}

AccountBillingHistory.displayName = 'AccountBillingHistory';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: sp(0.5),
  },
  textBlock: {
    flex: 1,
  },
});
