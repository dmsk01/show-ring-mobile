import Constants from 'expo-constants';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  serverUrl: string;
  assetsDir: string;
  auth: {
    method: 'jwt' | 'amplify' | 'firebase' | 'supabase' | 'auth0';
    skip: boolean;
    redirectPath: string;
  };
  firebase: {
    appId: string;
    apiKey: string;
    projectId: string;
    authDomain: string;
    storageBucket: string;
    measurementId: string;
    messagingSenderId: string;
  };
  amplify: { userPoolId: string; userPoolWebClientId: string; region: string };
  auth0: { clientId: string; domain: string; callbackUrl: string };
  supabase: { url: string; key: string };
};

// ----------------------------------------------------------------------

type ExpoExtra = {
  appName?: string;
  serverUrl?: string;
  assetsDir?: string;
  auth?: {
    method?: ConfigValue['auth']['method'];
    skip?: boolean;
  };
  firebase?: Partial<ConfigValue['firebase']>;
  amplify?: Partial<ConfigValue['amplify']>;
  auth0?: Partial<ConfigValue['auth0']>;
  supabase?: Partial<ConfigValue['supabase']>;
};

const extra = (Constants.expoConfig?.extra ?? {}) as ExpoExtra;

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: extra.appName ?? 'Minimal UI',
  appVersion: Constants.expoConfig?.version ?? '0.0.0',
  serverUrl: extra.serverUrl ?? '',
  assetsDir: extra.assetsDir ?? '',
  /**
   * Auth
   * @method jwt | amplify | firebase | supabase | auth0
   */
  auth: {
    method: extra.auth?.method ?? 'jwt',
    skip: extra.auth?.skip ?? false,
    redirectPath: paths.dashboard.root,
  },
  /**
   * Firebase
   */
  firebase: {
    apiKey: extra.firebase?.apiKey ?? '',
    authDomain: extra.firebase?.authDomain ?? '',
    projectId: extra.firebase?.projectId ?? '',
    storageBucket: extra.firebase?.storageBucket ?? '',
    messagingSenderId: extra.firebase?.messagingSenderId ?? '',
    appId: extra.firebase?.appId ?? '',
    measurementId: extra.firebase?.measurementId ?? '',
  },
  /**
   * Amplify
   */
  amplify: {
    userPoolId: extra.amplify?.userPoolId ?? '',
    userPoolWebClientId: extra.amplify?.userPoolWebClientId ?? '',
    region: extra.amplify?.region ?? '',
  },
  /**
   * Auth0
   */
  auth0: {
    clientId: extra.auth0?.clientId ?? '',
    domain: extra.auth0?.domain ?? '',
    callbackUrl: extra.auth0?.callbackUrl ?? '',
  },
  /**
   * Supabase
   */
  supabase: {
    url: extra.supabase?.url ?? '',
    key: extra.supabase?.key ?? '',
  },
};
