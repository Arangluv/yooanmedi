import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { s3Storage } from '@payloadcms/storage-s3';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { Collections, getAllCollection } from './collections';
import { getAllGlobal } from './globals';
import { translations as ko } from '../../../assets/payload-translation';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Collections.user.slug,
    timezones: {
      defaultTimezone: 'Asia/Seoul',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      Nav: '@/shared/ui/admin/sidebar/EmptyPayloadNav',
      header: ['@/shared/ui/admin/Header'],
      views: {
        dashboard: {
          Component: '@/shared/ui/admin/DashBoard',
        },
      },
      graphics: {
        Icon: '@/shared/ui/logos#HomeIcon',
        Logo: '@/shared/ui/logos#BrandLogoSmall',
      },
      providers: [
        '@/shared/ui/admin/sidebar/sidebar-provider',
        '@/shared/ui/admin/toast/toast-provider',
      ],
    },
  },
  collections: getAllCollection(),
  globals: getAllGlobal(),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, '../../../types/payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  i18n: {
    fallbackLanguage: 'ko',
    supportedLanguages: {
      ko: {
        dateFNSKey: 'ko',
        translations: ko,
      },
    },
    translations: {
      ko: ko,
    },
  },
  plugins: [
    s3Storage({
      collections: {
        image: true,
        files: true,
        'banner-image': true,
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
        endpoint: process.env.S3_ENDPOINT!,
        region: 'auto',
      },
    }),
  ],
});
