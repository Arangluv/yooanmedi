import { UpdateScenario } from '../../constants/scenario';
import { updateAction } from './action';

export const updateStrategy = {
  execute: async ({
    scenario,
    targetOrderIds,
  }: {
    scenario: UpdateScenario;
    targetOrderIds: number[];
  }) => {
    await updateAction[scenario]({ targetOrderIds });
  },
};
