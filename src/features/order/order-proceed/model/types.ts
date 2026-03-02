type ExecuteSuccessResult = {
  success: true;
  message: string;
};

interface ExecuteErrorResult {
  success: false;
  message: string;
}

export type ExecuteActionResult = ExecuteSuccessResult | ExecuteErrorResult;
