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
    const { covmat, old_features, new_features, restored_features } = this.props;
    const oldFeaturesT = transpose(old_features);
    const newFeaturesT = transpose(new_features);
    const restoredFeaturesT = transpose(restored_features);
    return (
      <div className={cn()}>
        <Paper className={cn('info')}>
          <Typography type="title">Результат роботи</Typography>
          <Typography>
            Розмірність вибірки
            {old_features.length !== new_features.length ? <span>зменшена з n = {old_features.length}, до w = {new_features.length}.</span>
              : <span>не зменшена</span>}
          </Typography>
        </Paper>
        {new_features.length === 2 ? <TwoDim old={old_features.length !== 2 ? null : old_features} data={new_features} /> : <div />}
        <Paper className={cn('cov-matrix')}>
          <Typography type="title">Коваріаційна матриця</Typography>
          <Table>
            <TableBody>
              {covmat.map((item) => <TableRow style={{ height: '30px' }}>{item.map((iitem) => <TableCell padding="none">{num(iitem)}</TableCell>)}</TableRow>)}
            </TableBody>
          </Table>
        </Paper>
        <Paper className={cn('two-matrix')}>
          <section className={cn('matrix')}>
            <Typography type="title">Початкові і відновлені данні</Typography>
            <Table>
              <TableHead>
                <TableRow>{old_features.map((item, index) => <TableCell>X{index}</TableCell>)}</TableRow>
              </TableHead>
              <TableBody>
                {oldFeaturesT.map(
                  (item, index) => (
                    <TableRow style={{ height: '30px' }}>
                      {item.map((iitem, iindex) =>
                        (
                          <TableCell padding="none">
                            {num(iitem)} <Typography type="caption">{num(restoredFeaturesT[index][iindex])}</Typography>
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </section>
          <section className={cn('matrix')}>
            <Typography type="title">Оброблені данні</Typography>
            <Table>
              <TableHead>
                <TableRow>{new_features.map((item, index) => <TableCell>X{index}</TableCell>)}</TableRow>
              </TableHead>
              <TableBody>
                {newFeaturesT.map((item) => <TableRow style={{ height: '30px' }}>{item.map((iitem) => <TableCell padding="none">{num(iitem)}</TableCell>)}</TableRow>)}
              </TableBody>
            </Table>
          </section>
        </Paper>
      </div>
    );
  }
}
