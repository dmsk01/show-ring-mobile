/**
 * AccountBillingPlan — mobile port (simplified).
 *
 * Divergence from web:
 *  - AddressListDialog / PaymentCardListDialog removed — depend on
 *    `sections/address` and `sections/payment` not yet ported.
 *    TODO(stage-5): restore dialogs when address/payment sections land.
 *  - PlanFreeIcon / PlanStarterIcon / PlanPremiumIcon replaced with Iconify glyphs.
 *  - ButtonBase replaced with Pressable.
 */

import { useTheme } from 'src/theme';
import { sp } from 'src/theme/core/spacing';
import { useState, useCallback } from 'react';
import { Iconify } from 'src/components/iconify';
import { Pressable, StyleSheet } from 'react-native';
import { Card, Stack, Button, Typography } from 'src/components/mui';

import type { JSX } from 'react';
import type { IconifyName } from 'src/components/iconify';

// ----------------------------------------------------------------------

const PLAN_ICONS: Record<string, IconifyName> = {
  basic: 'solar:shield-check-bold',
  starter: 'solar:cup-star-bold',
  premium: 'solar:verified-check-bold',
};

type Plan = { subscription: string; price: number; primary: boolean };

type Props = {
  plans: Plan[];
};

export function AccountBillingPlan({ plans }: Props): JSX.Element {
  const { theme } = useTheme();

  const currentPlan = plans.find((p) => p.primary);
  const [selectedPlan, setSelectedPlan] = useState('');

  const handleSelectPlan = useCallback(
    (subscription: string) => {
      if (currentPlan?.subscription !== subscription) {
        setSelectedPlan(subscription);
      }
    },
    [currentPlan]
  );

  return (
    <Card>
      <Typography variant="h6" sx={{ padding: sp(3), paddingBottom: sp(2) }}>
        Plan
      </Typography>

      <Stack spacing={2} sx={{ paddingHorizontal: sp(3) }}>
        {plans.map((plan) => {
          const isSelected = plan.subscription === selectedPlan;
          const isCurrent = plan.primary;
          const icon = PLAN_ICONS[plan.subscription] ?? 'solar:star-bold';

          return (
            <Pressable
              key={plan.subscription}
              onPress={() => handleSelectPlan(plan.subscription)}
              style={[
                styles.planCard,
                isSelected && styles.planCardSelected,
                isCurrent && styles.planCardDimmed,
                {
                  borderColor: isSelected ? theme.palette.text.primary : theme.palette.divider,
                  backgroundColor: theme.palette.background.paper,
                },
              ]}
            >
              <Iconify icon={icon} width={32} color={theme.palette.primary.main} />

              <Stack direction="row" sx={{ marginTop: sp(1.5), alignItems: 'center', gap: sp(1) }}>
                <Typography variant="subtitle2" sx={{ textTransform: 'capitalize', flex: 1 }}>
                  {plan.subscription}
                </Typography>
                {isCurrent && (
                  <Typography variant="caption" sx={{ color: 'info.main' }}>
                    Current
                  </Typography>
                )}
              </Stack>

              <Typography variant="h5" sx={{ marginTop: sp(0.5) }}>
                {plan.price === 0 ? 'Free' : `$${plan.price}/mo`}
              </Typography>
            </Pressable>
          );
        })}
      </Stack>

      <Stack direction="row" sx={{ padding: sp(3), justifyContent: 'flex-end', gap: sp(1.5) }}>
        <Button variant="outlined">Cancel plan</Button>
        <Button variant="contained">Upgrade plan</Button>
      </Stack>
    </Card>
  );
}

AccountBillingPlan.displayName = 'AccountBillingPlan';

const styles = StyleSheet.create({
  planCard: {
    padding: sp(2),
    borderRadius: sp(1.5),
    borderWidth: 1,
  },
  planCardSelected: {
    borderWidth: 2,
  },
  planCardDimmed: {
    opacity: 0.48,
  },
});
