import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';
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
import { useHistory, useParams } from 'react-router-dom';
import { tap } from 'rxjs/operators';
import demandService from 'services/demand';
import * as yup from 'yup';

// import Alert from 'components/Shared/Alert';
// import { useCallbackObservable } from 'react-use-observable';
// import { from } from 'rxjs';

const useStyle = makeStyles(theme => ({
  cardBody: {
    padding: theme.spacing(2)
  },
  textInput: {
    width: '100%',
    border: `2px solid ${theme.palette.secondary.light}`,
    borderRadius: 8,
    overflow: 'hidden'
  },
  actions: {
    justifyContent: 'center'
  }
}));
interface IProps {
  demand: IDemand;
}

const validationSchema = yup.object().shape({
  name: yup.string().required().min(4).max(50),
  description: yup.string(),
  quantity: yup.number(),
  value: yup.number()
});

const DemandForm = memo((props: IProps) => {
  const classes = useStyle(props);
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const [demand, setDemands] = useState<IDemand>();

  const fetchMyAPI = useCallback(async () => {
    setLoading(true);
    const response = await Axios.get(`http://0.0.0.0:3001/admin/demand/${id}`);
    if (response) {
      setDemands(response.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMyAPI();
  }, [fetchMyAPI]);

  const formik = useFormikObservable<IDemand>({
    validationSchema,
    onSubmit(model) {
      return demandService.save(model).pipe(
        tap(demand => {
          Toast.show(`O pedido: ${demand.name} foi salvo!`);
          history.push('/pedidos');
        }),
        logError(true)
      );
    }
  });
  const handleEnter = useCallback(() => {
    formik.setValues(demand ?? formik.initialValues, false);
  }, [formik, demand]);

  const handleBack = () => {
    history.push('/pedidos');
  };

  useEffect(() => {
    handleEnter();
  }, [demand]);

  return (
    <Fragment>
      <Toolbar title='Pedido' />
      <ToolbarTabs>
        <Tabs value={0} color='primary'>
          <Tab label='Editar pedido' />
        </Tabs>
      </ToolbarTabs>
      <Card className={classes.cardBody}>
        <>
          {loading && <LinearProgress color='primary' />}
          {formik.isSubmitting && <LinearProgress color='primary' />}
          <form onSubmit={formik.handleSubmit}>
            <CardContent>
              <Typography variant='subtitle1' gutterBottom>
                {demand && demand.name}
              </Typography>
            </CardContent>
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={6} sm={6}>
                  <TextField label='Nome' className={classes.textInput} name='name' formik={formik} />
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    multiline
                    rows='4'
                    className={classes.textInput}
                    label='Descrição'
                    name='description'
                    formik={formik}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    mask='number'
                    className={classes.textInput}
                    label='Quantidade'
                    name='quantity'
                    formik={formik}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <TextField mask='money' className={classes.textInput} label='Valor' name='value' formik={formik} />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Grid container>
                <Grid item xs={6} spacing={3}>
                  <Grid container spacing={2} className={classes.actions}>
                    <Button fullWidth onClick={handleBack}>
                      Voltar
                    </Button>
                    <Button fullWidth color='primary' variant='contained' type='submit' disabled={formik.isSubmitting}>
                      Salvar
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardActions>
          </form>
        </>
      </Card>
    </Fragment>
  );
});
export default DemandForm;
