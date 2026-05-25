import type { ListViewServerProps } from 'payload';
import { DefaultListView } from '@payloadcms/ui';
import DialogProvider from './DialogProvider';

const UserListViewSetDialog = async (props: ListViewServerProps) => {
  return (
    <DialogProvider>
      <DefaultListView
        viewType={props.viewType}
        Description={props.Description}
        BeforeList={props.BeforeList}
        BeforeListTable={props.BeforeListTable}
        AfterListTable={props.AfterListTable}
        AfterList={props.AfterList}
        collectionSlug={props.collectionSlug}
        columnState={props.columnState}
        disableBulkDelete={props.disableBulkDelete}
        disableBulkEdit={props.disableBulkEdit}
        enableRowSelections={props.enableRowSelections}
        hasCreatePermission={props.hasCreatePermission}
        newDocumentURL={props.newDocumentURL}
        renderedFilters={props.renderedFilters}
        Table={props.Table}
      />
    </DialogProvider>
  );
};

export default UserListViewSetDialog;
