import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import Toolbar from 'components/Layout/Toolbar';
import ToolbarTabs from 'components/Layout/ToolbarTabs';
import IDemand from 'interfaces/models/demand';
import React, { Fragment, memo } from 'react';

const useStyle = makeStyles(theme => ({
  cardActions: {
    justifyContent: 'flex-end'
  }
}));

interface IProps {
  demand: IDemand;
  onEdit: (demand: IDemand) => void;
  onDeleteComplete: () => void;
}

const DemandForm = memo((props: IProps) => {
  const classes = useStyle(props);

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
        <CardContent>
          <Typography variant='subtitle1' gutterBottom>
            Image Cropper + Compressor
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}></CardActions>
      </Card>
    </Fragment>
  );
});
export default DemandForm;
