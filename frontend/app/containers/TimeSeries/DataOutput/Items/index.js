import React from 'react';
import { connect } from 'react-redux';
import Table, { TableBody, TableHead, TableCell, TableRow } from 'material-ui/Table';
import Typography from 'material-ui/Typography';

export default class Items extends React.PureComponent {

  render() {
    const { data, onRemoveItem } = this.props;

    return (
      <div className={'data-output__data__items'}>
        <Table>
          <TableBody>
            {data.map((item, index) => (
              <TableRow style={{ height: '30px' }}>
                <TableCell padding="none">
                  {index !== 0 && index + 1 !== data.size && <span onClick={() => onRemoveItem(index)}>x</span>}
                </TableCell>
                <TableCell padding="none">{index}.</TableCell>
                <TableCell padding="none">{item}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}
