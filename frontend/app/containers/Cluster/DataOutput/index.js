import React from 'react';
import 'react-vis/dist/style.css';
import cnDecorator from 'cn-decorator';
import Typography from 'material-ui/Typography';
import Table, { TableBody, TableHead, TableCell, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';

import TwoDim from './TwoDim';

import './index.css';

const transpose = m => m[0].map((x, i) => m.map(x => x[i]));
const num = (value, dec = 2) => parseFloat(Math.round(value * 100) / 100).toFixed(dec);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

@cnDecorator('data-output')
export default class DataOutput extends React.Component {

  render(cn) {
    const { clusterized, points } = this.props;

    return (
      <div className={cn()}>
        <div className={cn('two-matrix')}>
          <div>
            <Typography className="title" type="title">Дані</Typography>
            <Paper className={cn('cov-matrix')}>
              <Table>
                <TableHead>
                  <TableRow><TableCell>X</TableCell><TableCell>Y</TableCell></TableRow>
                </TableHead>
                <TableBody>
                  {points.map((item) => <TableRow style={{ height: '30px' }}>{item.map((iitem) => <TableCell padding="none">{num(iitem)}</TableCell>)}</TableRow>)}
                </TableBody>
              </Table>
            </Paper>
          </div>
          <div className={cn('cluster')} >
            <Typography className="title" type="title">Кластеризовані дані</Typography>
            <TwoDim clusterized={clusterized} />
          </div>
        </div>
        {/*<Paper className={cn('two-matrix')}>*/}
          {/*<section className={cn('matrix')}>*/}
            {/*<Typography type="title">Початкові і відновлені данні</Typography>*/}
            {/*<Table>*/}
              {/*<TableHead>*/}
                {/*<TableRow>{old_features.map((item, index) => <TableCell>X{index}</TableCell>)}</TableRow>*/}
              {/*</TableHead>*/}
              {/*<TableBody>*/}
                {/*{oldFeaturesT.map(*/}
                  {/*(item, index) => (*/}
                    {/*<TableRow style={{ height: '30px' }}>*/}
                      {/*{item.map((iitem, iindex) =>*/}
                        {/*(*/}
                          {/*<TableCell padding="none">*/}
                            {/*{num(iitem)} <Typography type="caption">{num(restoredFeaturesT[index][iindex])}</Typography>*/}
                          {/*</TableCell>*/}
                        {/*)*/}
                      {/*)}*/}
                    {/*</TableRow>*/}
                  {/*)*/}
                {/*)}*/}
              {/*</TableBody>*/}
            {/*</Table>*/}
          {/*</section>*/}
          {/*<section className={cn('matrix')}>*/}
            {/*<Typography type="title">Оброблені данні</Typography>*/}
            {/*<Table>*/}
              {/*<TableHead>*/}
                {/*<TableRow>{new_features.map((item, index) => <TableCell>X{index}</TableCell>)}</TableRow>*/}
              {/*</TableHead>*/}
              {/*<TableBody>*/}
                {/*{newFeaturesT.map((item) => <TableRow style={{ height: '30px' }}>{item.map((iitem) => <TableCell padding="none">{num(iitem)}</TableCell>)}</TableRow>)}*/}
              {/*</TableBody>*/}
            {/*</Table>*/}
          {/*</section>*/}
        {/*</Paper>*/}
      </div>
    );
  }
}
