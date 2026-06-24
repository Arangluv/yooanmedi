import { ZodSchemaParser, SchemaParserDto } from '@/shared';
import { FavoriteProduct, FavoriteProductEntity } from '../types';
import { favoriteProductSchema, favoriteProductsSchema } from '../schemas';
import { FAVORITES_ERROR_MESSAGE } from '../constants';

export class FavoriteProductMapper {
  static entityToDomain(data: FavoriteProductEntity): FavoriteProduct {
    const dto = {
      data,
      errorMsg: FAVORITES_ERROR_MESSAGE.invalidData,
    } as SchemaParserDto;

    return ZodSchemaParser.safeParseOrThrow(favoriteProductSchema, dto);
  }

  static entitiesToDomainList(data: FavoriteProductEntity[]): FavoriteProduct[] {
    const dto = {
      data,
      errorMsg: FAVORITES_ERROR_MESSAGE.invalidData,
    } as SchemaParserDto;

    return ZodSchemaParser.safeParseOrThrow(favoriteProductsSchema, dto);
  }
}
