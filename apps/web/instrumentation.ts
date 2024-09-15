import * as Sentry from '@sentry/nextjs';

export function register() {
  Sentry.init({
    dsn: 'https://78a985efe7ea003edba4dad0eeb80a9b@o4506289111302144.ingest.sentry.io/4506289162289152',
    tracesSampleRate: 1,
    debug: false,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  });
}
