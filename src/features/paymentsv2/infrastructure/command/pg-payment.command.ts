import { PaymentCommand } from '../../core';
import { PaymentByPGRequestDto } from '../../dto';
import { EasyPayRepository } from '@/entities/easypay';

interface PGCommandResult {
  name: 'asd';
}

interface PGCommandDependencies {
  repository: {
    easyPay: any;
  };
}

export class PaymentCommandForPG implements PaymentCommand<PGCommandResult> {
  private readonly dto: PaymentByPGRequestDto;
  private readonly easyPayRepository: EasyPayRepository;

  constructor(dto: PaymentByPGRequestDto, dependencies: PGCommandDependencies) {
    this.dto = dto;
    this.easyPayRepository = dependencies.repository.easyPay;
  }

  async run() {
    return 'asd' as any;
  }

  async onRollback() {
    return 'asd ' as any;
  }

  async execute() {
    return 'asd' as any;
  }
}
