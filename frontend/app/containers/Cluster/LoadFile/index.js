import React from 'react';
import { Form, reduxForm, Field, formValues } from 'redux-form/immutable';
import Button from 'material-ui/Button';
import {
  TextField,
  Select,
} from 'redux-form-material-ui';
import { MenuItem } from 'material-ui/Menu';


import './index.css';

@reduxForm({
  form: 'mgk',
  initialValues: {
    threshold: '90',
    method: 'kmean',
    distance: 'm',
  },
})
@formValues('info')
export default class LoadFile extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { handleSubmit, onSubmit } = this.props;
    return (
      <div className="load-file">
        <Form encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
          <Field
            name="info"
            component="input"
            type="file"
            className="load-file__loader"
          />
          <Field
            className="load-file__threshold"
            name="x"
            component={TextField}
            label="№ вект. X"
            normalize={v => v.replace(/\D+/g, '').slice(0, 1)}
          />
          <Field
            className="load-file__threshold"
            name="y"
            component={TextField}
            label="№ вект. Y"
            normalize={v => v.replace(/\D+/g, '').slice(0, 1)}
          />
          <Field
            className="load-file__threshold"
            name="clusters"
            component={TextField}
            label="Кільк. класт."
            normalize={v => v.replace(/\D+/g, '').slice(0, 1)}
          />
          <Field
            className="load-file__select"
            name="method"
            component={Select}
            label="Метод"
          >
            <MenuItem value="kmean">К-середніх</MenuItem>
          </Field>
          <Field
            className="load-file__select"
            name="distance"
            component={Select}
            label="Відстань"
          >
            <MenuItem value="e">Евклідова відстань</MenuItem>
            <MenuItem value="m">Манхетенська відстань</MenuItem>
            <MenuItem value="ch">Відстань Чебишева</MenuItem>
          </Field>
          <Button className="load-file__button" raised color="primary" type="submit">Считати дані</Button>
        </Form>
      </div>
    );
  }
}
