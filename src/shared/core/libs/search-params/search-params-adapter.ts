import { LoaderFunction, ParserMap } from 'nuqs';
import { type SearchParams, createLoader, inferParserType } from 'nuqs/server';

export class ServerSearchParamsAdapter<T extends ParserMap> {
  // nuqs built-in parser 객체
  private parser: T;

  constructor(parser: T) {
    this.parser = parser;
  }

  public async getSafeSearchParam(
    searchParams: Promise<SearchParams>,
  ): Promise<inferParserType<T>> {
    const searchParamsLoader = this.getSearchParamsLoader();
    return await searchParamsLoader(searchParams);
  }

  private getSearchParamsLoader(): LoaderFunction<T> {
    return createLoader(this.parser);
  }
}
