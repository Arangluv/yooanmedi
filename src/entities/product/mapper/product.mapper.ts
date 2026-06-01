import { SchemaParserDto, ZodSchemaParser } from '@/shared';
import { PRODUCT_ERROR_MESSAGE } from '../constants';
import { productSchema, productListSchema, productCategoriesSchema } from '../schemas';
import { ProductEntity, ProductListEntity, ProductCategoryEntity } from '../types';

export class ProductMapper {
  static entityToProduct(data: ProductEntity) {
    const dto = {
      data,
      errorMsg: PRODUCT_ERROR_MESSAGE.invalidProduct,
    } as SchemaParserDto;

    return ZodSchemaParser.safeParseOrThrow(productSchema, dto);
  }

  static entityListToProductList(data: ProductListEntity) {
    const dto = {
      data: {
        products: data.docs,
        totalCount: data.totalDocs,
      },
      errorMsg: PRODUCT_ERROR_MESSAGE.invalidProduct,
    } as SchemaParserDto;

    return ZodSchemaParser.safeParseOrThrow(productListSchema, dto);
  }

  static categoryEntityToCategory(data: ProductCategoryEntity[]) {
    const dto = {
      data: data,
      errorMsg: PRODUCT_ERROR_MESSAGE.invalidProductCategory,
    } as SchemaParserDto;

    return ZodSchemaParser.safeParseOrThrow(productCategoriesSchema, dto);
  }
}
