import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import Axios from 'axios';
import Toolbar from 'components/Layout/Toolbar';
import ToolbarTabs from 'components/Layout/ToolbarTabs';
import TextField from 'components/Shared/Fields/Text';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import { useFormikObservable } from 'hooks/useFormikObservable';
import IDemand from 'interfaces/models/demand';
import React, { Fragment, memo, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { tap } from 'rxjs/operators';
import demandService from 'services/demand';
import * as yup from 'yup';

// import Alert from 'components/Shared/Alert';
// import { useCallbackObservable } from 'react-use-observable';
// import { from } from 'rxjs';

interface IProps {
  demand: IDemand;
  onComplete: (demand: IDemand) => void;
  onCancel: () => void;
}

const validationSchema = yup.object().shape({
  name: yup.string().required().min(4).max(50),
  description: yup.string(),
  quantity: yup.number(),
  value: yup.number()
});

const DemandForm = memo((props: IProps) => {
  // const history = useHistory();

  const { id } = useParams();
  const [demand, setDemands] = useState<IDemand>();

  const fetchMyAPI = useCallback(async () => {
    const response = await Axios.get(`http://0.0.0.0:3001/admin/demand/${id}`);
    if (response) {
      setDemands(response.data);
    }
  }, []);

  useEffect(() => {
    fetchMyAPI();
  }, [fetchMyAPI]);

  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(false);

  // const [handleDelete] = useCallbackObservable(() => {
  //   return from(Alert.confirm(`Deseja excluir o pedido ${demand.name}?`)).pipe(
  //     filter(ok => ok),
  //     tap(() => setLoading(true)),
  //     switchMap(() => demandService.delete(demand.id)),
  //     logError(),
  //     tap(
  //       () => {
  //         Toast.show(`O pedido ${demand.name} foi removido`);
  //         setLoading(true);
  //         history.push('/pedidos');
  //       },
  //       error => {
  //         setLoading(false);
  //         setError(error);
  //       }
  //     )
  //   );
  // }, []);

  const formik = useFormikObservable<IDemand>({
    validationSchema,
    onSubmit(model) {
      return demandService.save(model).pipe(
        tap(demand => {
          Toast.show(`O novo pedido ${demand.name} foi salvo!`);
          props.onComplete(demand);
        }),
        logError(true)
      );
    }
  });
  const handleEnter = useCallback(() => {
    formik.setValues(demand ?? formik.initialValues, false);
  }, [formik, demand]);

  useEffect(() => {
    handleEnter();
  }, [demand]);

  return (
    <Fragment>
      <Toolbar title='Extra' />
      <ToolbarTabs>
        <Tabs value={0} color='primary'>
          <Tab label='Image Cropper' />
          <Tab label='Nothing' />
        </Tabs>
      </ToolbarTabs>
      <Card>
        <>
          {/* {error && <span>{error}</span>}
          {loading && <LinearProgress color='primary' />} */}
          {formik.isSubmitting && <LinearProgress color='primary' />}
          <form onSubmit={formik.handleSubmit}>
            <CardContent>
              <Typography variant='subtitle1' gutterBottom>
                {demand && demand.name}
              </Typography>
            </CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label='Nome' name='name' formik={formik} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label='Descrição' name='description' formik={formik} />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField mask='number' label='Quantidade' name='quantity' formik={formik} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField mask='money' label='Valor' name='value' formik={formik} />
              </Grid>
            </Grid>

            <CardActions>
              <Button onClick={props.onCancel}>Cancelar</Button>
              <Button color='primary' variant='contained' type='submit' disabled={formik.isSubmitting}>
                Salvar
              </Button>
            </CardActions>
          </form>
        </>
      </Card>
    </Fragment>
  );
});
export default DemandForm;
