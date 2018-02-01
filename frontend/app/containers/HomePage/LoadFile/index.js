import React from 'react';
import { Form, reduxForm, Field, formValues } from 'redux-form';
import Button from 'material-ui/Button';

import './index.css';

@reduxForm({
  form: 'mgk',
})
@formValues('info')
export default class LoadFile extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  state = {
    file: null,
  };

  onChange(e) {
    this.setState({
      file: e.target.files[0],
    });
  }

  render() {
    const { handleSubmit, onSubmit } = this.props;
    return (
      <div className="load-file">
        <Form onSubmit={handleSubmit(() => onSubmit({ info: this.state.file }))}>
          <Field
            encType="multipart/form-data"
            name="info"
            component="input"
            onChange={(e) => this.onChange(e)}
            type="file"
          />
          <Button raised color="primary" type="submit">Считати дані</Button>
        </Form>
      </div>
    );
  }
}
