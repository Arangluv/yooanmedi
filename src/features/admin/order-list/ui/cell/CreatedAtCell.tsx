import { DefaultServerCellComponentProps } from 'payload';
import moment from 'moment';

const CreatedAtCell = (props: DefaultServerCellComponentProps) => {
  const createdAtCellData = props.cellData as string;

  return <div>{moment(createdAtCellData).format('YYYY-MM-DD')}</div>;
};

export default CreatedAtCell;
