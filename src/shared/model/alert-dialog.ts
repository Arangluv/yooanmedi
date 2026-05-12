export interface AlertDialogConfig {
  triggerText: string;
  headerTitle: string;
  description: string;
  action: DialogActionConfig;
}

export interface DialogActionConfig {
  text: string;
  onClick: () => void;
}
