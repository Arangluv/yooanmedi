import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { Users } from './collections/Users';
import { Image } from './collections/Image';
import { Files } from './collections/Files';
import { PopupSetting } from './collections/PopupSetting';
import { Terms } from './collections/Terms';
import { PrivacyPolicy } from './collections/PrivacyPolicy';
import { s3Storage } from '@payloadcms/storage-s3';
import { translations as ko } from '@lib/payload/utils/translation';
import { Product } from './collections/Product';
import { ProductCategory } from './collections/ProductCategory';
import { MetaSetting } from './collections/MetaSetting';
import { Order } from './collections/Order';
import { PointTransaction } from './collections/point-transaction';
import { OrderProduct } from './collections/order-product';
import { Payments } from './collections/payments';
import { RecentPurchasedHistory } from './collections/recent-purchased-history';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
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
        '@/shared/model/admin/nuqs-provider',
      ],
    },
  },
  collections: [
    Users,
    Image,
    Files,
    Product,
    ProductCategory,
    Order,
    OrderProduct,
    RecentPurchasedHistory,
    Payments,
    PointTransaction,
  ],
  globals: [PopupSetting, Terms, PrivacyPolicy, MetaSetting],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
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
      // en, // 기본 영어 번역 유지
      ko: {
        dateFNSKey: 'ko',
        translations: ko,
      },
    },
    translations: {
      ko: ko, // 선택사항: ko 커스텀 번역 병합용
    },
  },
  plugins: [
    s3Storage({
      collections: {
        image: true,
        files: true,
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
    // storage-adapter-placeholder
  ],
});
