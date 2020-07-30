import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Alert from 'components/Shared/Alert';
import { IOption } from 'components/Shared/DropdownMenu';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import IDemand from 'interfaces/models/demand';
import DeleteIcon from 'mdi-react/DeleteIcon';
import EditIcon from 'mdi-react/EditIcon';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useCallbackObservable } from 'react-use-observable';
import { from } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import demandService from 'services/demand';

interface IProps {
  demand: IDemand;
  onEdit: (demand: IDemand) => void;
  onDeleteComplete: () => void;
}

const ListItem = memo((props: IProps) => {
  const { demand, onEdit, onDeleteComplete } = props;

  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleDismissError = useCallback(() => setError(null), []);

  const handleEdit = useCallback(() => {
    onEdit(demand);
  }, [onEdit, demand]);

  const [handleDelete] = useCallbackObservable(() => {
    return from(Alert.confirm(`Deseja excluir o pedido ${demand.name}?`)).pipe(
      filter(ok => ok),
      tap(() => setLoading(true)),
      switchMap(() => demandService.delete(demand.id)),
      logError(),
      tap(
        () => {
          Toast.show(`O pedido ${demand.name} foi removido`);
          setLoading(true);
          setDeleted(true);
          onDeleteComplete();
        },
        error => {
          setLoading(false);
          setError(error);
        }
      )
    );
  }, []);

  const options = useMemo<IOption[]>(() => {
    return [
      { text: 'Editar', icon: EditIcon, handler: handleEdit },
      { text: 'Excluir', icon: DeleteIcon, handler: handleDelete }
    ];
  }, [handleDelete, handleEdit]);

  if (deleted) {
    return null;
  }

  return (
    <TableRow>
      <TableCell>{demand.name}</TableCell>
      <TableCell>{demand.description}</TableCell>
      <TableCell>{demand.quantity}</TableCell>
      <TableCell>
        {Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(demand.value)}
      </TableCell>
      <TableCellActions options={options} loading={loading} error={error} onDismissError={handleDismissError} />
    </TableRow>
  );
});

export default ListItem;
