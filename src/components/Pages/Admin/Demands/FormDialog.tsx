import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from 'components/Shared/Fields/Text';
import Grid from '@material-ui/core/Grid';
// import FormLabel from '@material-ui/core/FormLabel';
// import FormControl from '@material-ui/core/FormControl';
// import FormGroup from '@material-ui/core/FormGroup';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import CheckboxField from 'components/Shared/Fields/Checkbox';
import Slide from '@material-ui/core/Slide';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import { useFormikObservable } from 'hooks/useFormikObservable';
import IDemand from 'interfaces/models/demand';
import React, { forwardRef, memo, useCallback } from 'react';
import { tap } from 'rxjs/operators';
import demandService from 'services/demand';
import * as yup from 'yup';

interface IProps {
  opened: boolean;
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

const useStyle = makeStyles({
  content: {
    width: 600,
    maxWidth: 'calc(95vw - 50px)'
  },
  heading: {
    marginTop: 20,
    marginBottom: 10
  }
});

const FormDialog = memo((props: IProps) => {
  const classes = useStyle(props);

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
    formik.setValues(props.demand ?? formik.initialValues, false);
  }, [formik, props.demand]);

  const handleExit = useCallback(() => {
    formik.resetForm();
  }, [formik]);

  return (
    <Dialog
      open={props.opened}
      disableBackdropClick
      disableEscapeKeyDown
      onEnter={handleEnter}
      onExited={handleExit}
      TransitionComponent={Transition}
    >
      {formik.isSubmitting && <LinearProgress color='primary' />}

      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{formik.values.id ? 'Editar' : 'Novo'} Pedido</DialogTitle>
        <DialogContent className={classes.content}>
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
              <TextField type='number' label='Quantidade' name='quantity' formik={formik} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField type='number' label='Valor' name='value' formik={formik} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel}>Cancelar</Button>
          <Button color='primary' variant='contained' type='submit' disabled={formik.isSubmitting}>
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});

const Transition = memo(
  forwardRef((props: any, ref: any) => {
    return <Slide direction='up' {...props} ref={ref} />;
  })
);

export default FormDialog;
