import React from 'react';
import { Form, reduxForm, Field, formValues } from 'redux-form/immutable';
import Button from 'material-ui/Button';
import {
  TextField,
} from 'redux-form-material-ui';


import './index.css';

@reduxForm({
  form: 'ts',
  initialValues: {
    threshold: '90',
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
          <Button className="load-file__button" raised color="primary" type="submit">Считати дані</Button>
        </Form>
      </div>
    );
  }
}
