import React from 'react';
import 'react-vis/dist/style.css';
import cnDecorator from 'cn-decorator';
import Typography from 'material-ui/Typography';
import Table, { TableBody, TableHead, TableCell, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';

import TwoDim from './TwoDim';
import RollingForm from './RollingForm';
import Items from './Items';

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
    const { info, onRemoveItem, isDataChanged, onUpdateData, onSubmitRollingForm } = this.props;
    return (
      <div className={cn()}>
        <Paper className={cn('info')}>
          <Typography type="title">Часовий ряд</Typography>
          <Typography type="subheading">
            <b>Тест Манна-Уітні</b><br />
            <b>U=</b>{info.getIn(['mann_whitney', 'criteria'])} <b>Квантиль=</b>1.5555
            <Typography type="caption">
              {(info.getIn(['mann_whitney', 'criteria']) < -1.555 || info.getIn(['mann_whitney', 'criteria']) > 1.5555) && (
                <span>Процес не стаціонарний</span>
              )}
              {info.getIn(['mann_whitney', 'criteria']) > -1.555 && info.getIn(['mann_whitney', 'criteria']) < 1.5555 && (
                <span>Процес стаціонарний</span>
              )}
            </Typography>
            <br /><br />
            <b>Критерій серій</b><br />
              {info.get('median_series') && (
                <section>
                  <b>V=</b>{info.getIn(['median_series', 'longest'])} <b>Квантиль=</b>{info.getIn(['median_series', 'longest_q'])}
                  <br />
                  <b>D=</b>{info.getIn(['median_series', 'series_count'])} <b>Квантиль=</b>{info.getIn(['median_series', 'series_count_q'])}
                  <br />
                </section>
              )}
              {info.getIn(['median_series', 'longest']) < info.getIn(['median_series', 'longest_q']) &&
                info.getIn(['median_series', 'series_count']) > info.getIn(['median_series', 'series_count_q'])
              ? <span>Тренд відсутній</span> : <span>Тренд присутній</span>}
              <br /><br />
              <b>Критерій зростаючих і спадаючих серій</b><br />
              {info.get('up_down_series') && (
                  <section>
                    <b>V=</b>{info.getIn(['up_down_series', 'longest'])} <b>Квантиль=</b>{info.getIn(['up_down_series', 'longest_q'])}
                    <br />
                    <b>D=</b>{info.getIn(['up_down_series', 'series_count'])} <b>Квантиль=</b>{info.getIn(['up_down_series', 'series_count_q'])}
                    <br />
                  </section>
                )}
                {info.getIn(['up_down_series', 'longest']) < info.getIn(['up_down_series', 'longest_q']) &&
                  info.getIn(['up_down_series', 'series_count']) > info.getIn(['up_down_series', 'series_count_q'])
                ? <span>Тренд відсутній</span> : <span>Тренд присутній</span>}
          </Typography>
        </Paper>
        <Paper className={cn('data')}>
          <TwoDim data={info.get('data')} />
          <Items data={info.get('data')} onRemoveItem={onRemoveItem} />
          {isDataChanged && <Button className={cn('update')} raised color="primary" onClick={onUpdateData} >Оновити графіки</Button>}
        </Paper>
        <section className={cn('half')}>
          <section>
            <Paper className={cn('info')}>
              <Typography type="title">Графік авторкореляційної функції</Typography>
            </Paper>
            <Paper>
              <TwoDim data={info.get('auto_corr')} />
            </Paper>
          </section>
          <section>
            <Paper className={cn('info')}>
              <Typography type="title">Автоматичне фільтрування аномальних значень</Typography>
            </Paper>
            <Paper>
              <TwoDim data={info.get('abnormal')} old={info.get('data')} />
            </Paper>
          </section>
        </section>
        <Paper className={cn('info')}>
          <Typography type="title">Зглажування</Typography>
        </Paper>
        <Paper>
          <RollingForm onSubmit={onSubmitRollingForm} />
        </Paper>
        {info.has('rolling') && (
          <section>
            <section className={cn('half')}>
              <section>
                <Paper className={cn('info')}>
                  <Typography type="title">Медіанне</Typography>
                </Paper>
                <Paper>
                  <TwoDim data={info.getIn(['rolling', 'median'])} old={info.get('data')} />
                </Paper>
              </section>
            </section>
            <section className={cn('half')}>
              <section>
                <Paper className={cn('info')}>
                  <Typography type="title">SMA</Typography>
                </Paper>
                <Paper>
                  <TwoDim data={info.getIn(['rolling', 'sma'])} old={info.get('data')} />
                </Paper>
              </section>
              <section>
                <Paper className={cn('info')}>
                  <Typography type="title">WMA</Typography>
                </Paper>
                <Paper>
                  <TwoDim data={info.getIn(['rolling', 'wma'])} old={info.get('data')} />
                </Paper>
              </section>
            </section>
            <section className={cn('half')}>
              <section>
                <Paper className={cn('info')}>
                  <Typography type="title">EMA</Typography>
                </Paper>
                <Paper>
                  <TwoDim data={info.getIn(['rolling', 'ema'])} old={info.get('data')} />
                </Paper>
              </section>
              <section>
                <Paper className={cn('info')}>
                  <Typography type="title">DMA</Typography>
                </Paper>
                <Paper>
                  <TwoDim data={info.getIn(['rolling', 'dma'])} old={info.get('data')} />
                </Paper>
              </section>
            </section>
             <section className={cn('half')}>
              <section>
                <Paper className={cn('info')}>
                  <Typography type="title">TMA</Typography>
                </Paper>
                <Paper>
                  <TwoDim data={info.getIn(['rolling', 'tma'])} old={info.get('data')} />
                </Paper>
              </section>
            </section>
          </section>
        )}
        {/*{new_features.length === 2 ? <TwoDim old={old_features.length !== 2 ? null : old_features} data={new_features} /> : <div />}*/}
        {/*<Paper className={cn('cov-matrix')}>*/}
          {/*<Typography type="title">Коваріаційна матриця</Typography>*/}
          {/*<Table>*/}
            {/*<TableBody>*/}
              {/*{covmat.map((item) => <TableRow style={{ height: '30px' }}>{item.map((iitem) => <TableCell padding="none">{num(iitem)}</TableCell>)}</TableRow>)}*/}
            {/*</TableBody>*/}
          {/*</Table>*/}
        {/*</Paper>*/}
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
