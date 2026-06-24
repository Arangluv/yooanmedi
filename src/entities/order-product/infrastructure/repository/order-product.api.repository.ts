import { type OrderProductRepository } from '../../core';
import {
  BulkUpdateOrderProductRequestDto,
  CreateOrderProductRequestDto,
  UpdateOrderProductRequestDto,
} from '../../dto';
import { OrderProductAdapter } from '../api';
import { OrderProductMapper } from '../../mapper';
import { FindOption } from '@/shared';

export class OrderProductApiRepository implements OrderProductRepository {
  private adapter: ReturnType<typeof OrderProductAdapter>;

  constructor(adapter: ReturnType<typeof OrderProductAdapter>) {
    this.adapter = adapter;
  }

  async create(dto: CreateOrderProductRequestDto) {
    const response = await this.adapter.createOrderProduct(dto);
    if (!response.ok) {
      throw response.error;
    }
    return OrderProductMapper.reponseToDto(response.data);
  }

  async findById(id: number) {
    const response = await this.adapter.getOrderProductById(id);
    if (!response.ok) {
      throw response.error;
    }
    return OrderProductMapper.reponseToDto(response.data);
  }

  async findMany(option: FindOption) {
    const response = await this.adapter.getOrderProducts(option);
    if (!response.ok) {
      throw response.error;
    }
    return OrderProductMapper.reponseToDtoList(response.data);
  }

  async update(dto: UpdateOrderProductRequestDto) {
    const response = await this.adapter.updateOrderProduct(dto);
    if (!response.ok) {
      throw response.error;
    }
    return OrderProductMapper.reponseToDto(response.data);
  }

  async updateMany(dto: BulkUpdateOrderProductRequestDto) {
    const response = await this.adapter.bulkUpdateOrderProduct(dto);
    if (!response.ok) {
      throw response.error;
    }
    return OrderProductMapper.reponseToDtoList(response.data);
  }
}
