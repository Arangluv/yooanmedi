import { ZodSchemaParser, SchemaParserDto } from '@/shared';
import { Favorite, FavoriteEntity } from '../types';
import { favoriteSchema, favoritesSchema } from '../schemas';
import { FAVORITES_ERROR_MESSAGE } from '../constants';

export class FavoriteMapper {
  static entityToDomain(data: FavoriteEntity): Favorite {
    const dto = {
      data,
      errorMsg: FAVORITES_ERROR_MESSAGE.invalidData,
    } as SchemaParserDto;

    return ZodSchemaParser.safeParseOrThrow(favoriteSchema, dto);
  }

  static entitiesToDomainList(data: FavoriteEntity[]): Favorite[] {
    const dto = {
      data,
      errorMsg: FAVORITES_ERROR_MESSAGE.invalidData,
    } as SchemaParserDto;

    return ZodSchemaParser.safeParseOrThrow(favoritesSchema, dto);
  }
}
