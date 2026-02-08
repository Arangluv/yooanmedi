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
import { PointHistory } from './collections/PointHistory';
import { OrderStatus } from './collections/OrderStatus';
import { Order } from './collections/Order';
import { MetaSetting } from './collections/MetaSetting';
import { ProductPrice } from './collections/ProductPrice';
import { PointTransactions } from './collections/point-transactions';

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
      graphics: {
        Icon: '@/shared/ui/logos#HomeIcon',
        Logo: '@/shared/ui/logos#BrandLogoSmall',
      },
    },
  },

  collections: [
    Users,
    Image,
    Files,
    Product,
    ProductCategory,
    PointHistory,
    OrderStatus,
    Order,
    ProductPrice,
    PointTransactions,
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
