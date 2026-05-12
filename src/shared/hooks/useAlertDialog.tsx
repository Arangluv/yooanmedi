import * as React from 'react';
import { alertDialogContext } from '../model/providers/alert-dialog-provider';

const useAlertDialog = () => {
  const alertContext = React.useContext(alertDialogContext);

  if (!alertContext) {
    throw new Error('useAlertDialog는 AlertDialogProvider 내부에서만 사용할 수 있습니다.');
  }

  return alertContext;
};

export default useAlertDialog;
