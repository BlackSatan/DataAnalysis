import React from 'react';
import { reduxForm, Form, Field } from 'redux-form/immutable';
import Button from 'material-ui/Button';
import cn from 'cn-decorator';
import {
  TextField,
} from 'redux-form-material-ui';
import './index.css';

@reduxForm({
  form: 'rolling'
})
@cn('rolling-form')
export default class RollingForm extends React.PureComponent {

  render(bem) {
    const { handleSubmit, onSubmit } = this.props;
    return (
      <Form className={bem()} onSubmit={handleSubmit(onSubmit)}>
        <Field
          component={TextField}
          name="window"
          className={bem('field')}
          label="Розмір вікна"
          normalize={v => v.replace(/\D+/g, '')}
        />
        <Button type="submit">Показати графік</Button>
      </Form>
    );
  }
}
