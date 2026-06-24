import * as React from 'react';
import { alertDialogContext } from '../providers/alert-dialog-provider';

export const useAlertDialog = () => {
  const alertContext = React.useContext(alertDialogContext);

  if (!alertContext) {
    throw new Error('useAlertDialog는 AlertDialogProvider 내부에서만 사용할 수 있습니다.');
  }

  return alertContext;
};
