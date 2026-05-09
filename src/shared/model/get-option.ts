import { Where, Sort } from 'payload';

interface BaseFindOption {
  where?: Where;
  sort?: Sort;
  depth?: number;
  populate?: Record<any, any>;
}

interface PaginationTrueFindOption extends BaseFindOption {
  pagination: true;
  page: number;
  limit: number;
}

interface PaginationFalseFindOption extends BaseFindOption {
  pagination: false;
  limit?: number;
}

export type FindOption = PaginationTrueFindOption | PaginationFalseFindOption;
