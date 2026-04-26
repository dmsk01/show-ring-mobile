import * as Burnt from 'burnt';
import { useForm } from 'react-hook-form';
import { sp } from 'src/theme/core/spacing';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { Card, Stack, Button } from 'src/components/mui';

import type { JSX } from 'react';
import type { ISocialLink } from 'src/types/common';
import type { IconifyName } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  socialLinks: ISocialLink;
};

const SOCIAL_ICONS: Record<keyof ISocialLink, IconifyName> = {
  twitter: 'socials:twitter',
  facebook: 'socials:facebook',
  instagram: 'socials:instagram',
  linkedin: 'socials:linkedin',
};

export function AccountSocials({ socialLinks }: Props): JSX.Element {
  const defaultValues: ISocialLink = {
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
  };

  const methods = useForm({
    defaultValues,
    values: socialLinks,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      Burnt.toast({ title: 'Update success!', preset: 'done' });
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ padding: sp(3), gap: sp(3), display: 'flex', flexDirection: 'column' }}>
        {(Object.keys(SOCIAL_ICONS) as Array<keyof ISocialLink>).map((social) => (
          <Field.Text
            key={social}
            name={social}
            label={social.charAt(0).toUpperCase() + social.slice(1)}
            startAdornment={<Iconify width={24} icon={SOCIAL_ICONS[social]} />}
          />
        ))}

        <Stack sx={{ alignItems: 'flex-end' }}>
          <Button variant="contained" loading={isSubmitting} onClick={onSubmit}>
            Save changes
          </Button>
        </Stack>
      </Card>
    </Form>
  );
}

AccountSocials.displayName = 'AccountSocials';
