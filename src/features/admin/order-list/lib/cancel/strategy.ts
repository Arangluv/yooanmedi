import { CancelScenario } from '../../constants/scenario';
import { cancelAction } from './action';

export const cancelStrategy = {
  execute: async ({
    scenario,
    targetOrderIds,
  }: {
    scenario: CancelScenario;
    targetOrderIds: number[];
  }) => {
    await cancelAction[scenario]({ targetOrderIds });
  },
};
