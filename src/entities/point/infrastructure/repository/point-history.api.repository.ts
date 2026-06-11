import { FindOption } from '@/shared';
import { PointHistoryAdapter } from '../api';
import { CreateUsagePointHistoryRequestDto, CreateRollbackPointHistoryRequestDto } from '../../dto';
import { PointHistoryRepository } from '../../core';
import { PointHistoryMapper } from '../../mapper';
import { POINT_ACTION } from '../../constants';
import { PointHistoryFindOption } from '../../libs';

export class PointHistoryApiRepository implements PointHistoryRepository {
  private adapter: ReturnType<typeof PointHistoryAdapter>;

  constructor(adapter: ReturnType<typeof PointHistoryAdapter>) {
    this.adapter = adapter;
  }

  public async createUsageHistory(dto: CreateUsagePointHistoryRequestDto) {
    const result = await this.adapter.create(dto);
    if (!result.ok) {
      throw result.error;
    }
    return PointHistoryMapper.entityToDomain(result.data);
  }

  public async createRollbackHistory(dto: CreateRollbackPointHistoryRequestDto) {
    const option =
      dto.type === POINT_ACTION.cancel_use
        ? PointHistoryFindOption.findOne.use(dto)
        : PointHistoryFindOption.findOne.earn(dto);
    const rollbackHistory = await this.findOne(option);

    const entity = PointHistoryMapper.toRequestEntity({ dto, rollbackHistory });
    const result = await this.adapter.create(entity);

    if (!result.ok) {
      throw result.error;
    }

    return PointHistoryMapper.entityToDomain(result.data);
  }

  public async findOne(option: FindOption) {
    const result = await this.adapter.findOne(option);
    if (!result.ok) {
      throw result.error;
    }
    return PointHistoryMapper.entityToDomain(result.data);
  }
}
