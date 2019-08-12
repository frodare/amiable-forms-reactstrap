import React, {useState} from "react";
import ReactDOM from "react-dom";
import { Form, useField, useForm, Debug, useArrayField } from "amiable-forms";
import {
  Input,
  Container,
  Button,
  Label,
  FormFeedback,
  FormGroup,
  Col,
  Row
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.scss";
import get from 'amiable-forms/dist/util/get'
import set from 'amiable-forms/dist/util/set'
import clone from 'amiable-forms/dist/util/clone'

const Field = ({ name, label, validators, parse, format, placeholder }) => {
  const { value, onChange, onBlur, valid, error, touched, submitted } = useField({
    name,
    validators,
    parse,
    format
  });
  const invalidFlag = (submitted || touched) && !valid ? true : undefined;
  const validFlag = (submitted || touched) && valid ? true : undefined;
  return (
    <FormGroup>
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        valid={validFlag}
        invalid={invalidFlag}
        placeholder={placeholder}
      />
      { invalidFlag ? <FormFeedback invalid=''><div>{error}</div></FormFeedback> : <FormFeedback /> }
    </FormGroup>
  );
};

const Users = () => {
  const { push, pop, elements } = useArrayField({ name: 'users', Component: Field, props: { label: 'Test'} })
  return (
    <>
      {elements}
      <div>
      <button onClick={push}>Add</button>
      <button onClick={pop}>Remove</button>
      </div>
    </>
  )
}


const RepeatedField = ({ prefix }) => {
  const [count, setCount] = useState(2)
  return (
    <>
      {new Array(count).fill('').map((_, i) => <Field key={i} name={prefix + '_' + i} />)}
      <button onClick={() => setCount(count - 1)}>remove</button><button onClick={() => setCount(count + 1)}>add</button>
    </>
  )
}

const SubmitButtons = () => {
  const { onSubmit, clear, setValues } = useForm({ shouldUpdate: () => false });
  const name = {name: { first: 'John', last: 'Smith' }}
  return (
    <>
      <Row className="py-4">
        <Col>
          <Button block color="light" onClick={() => setValues(name)}>
            Set Name
          </Button>
        </Col>
        <Col>
          <Button block color="light" onClick={() => setValues(name, { merge: true, keepMeta: true })}>
            Set Name (merge/keepMeta)
          </Button>
        </Col>
      </Row>
      <Row className="py-4">
        <Col>
          <Button block outline onClick={clear}>
            Clear
          </Button>
        </Col>
        <Col>
          <Button block color="primary" onClick={onSubmit}>
            Submit
          </Button>
        </Col>
      </Row>
    </>
  );
};

const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

const required = v => (v !== 0 && !v ? "required" : null);
const minLength = l => v => (v || "").length < l ? "length must be at least " + l : undefined;
const validEmail = v =>
  EMAIL_PATTERN.test(v)
    ? undefined
    : "invalid email address";

const processForm = values => console.log("form processed", values);
const processInvalid = (meta, fields) =>
  console.log("form invalid", meta, fields);

const initialValues = {
  name: {
    first: 'Initial First Name'
  }
}

const transform = ({ next, current }) => {
  if (get(next, 'values.name.first') !== 'charles') return next
  if (get(next, 'values.name.last')) return next
  if ((next.fields['name.last'] || {}).touched) return next
  const out = clone(next)
  return out
}

const TestForm = () => (
  <Container>
    <h1>amiable-forms</h1>
    <p>An example of an amiable-form created with reactstrap.</p>
    <Form process={processForm} processInvalid={processInvalid} initialValues={initialValues} transform={transform}>
      <Row>
        <Col>
          <Field
            label="First Name"
            name="name.first"
            validators={[required, minLength(2)]}
          />
        </Col>
        <Col>
          <Field
            label="Last Name"
            name="name.last"
            validators={[required, minLength(2)]}
          />
        </Col>
      </Row>

      <Users />

      {new Array(1).fill('').map((_,i) => <Field
        key={i}
        label={"Email " + i}
        name={"email_" + i}
        placeholder="email"
        validators={[required, validEmail]}
      />)}

      <RepeatedField prefix={'repeated_field'} count={5} />

      <SubmitButtons />
      <Debug />
    </Form>
  </Container>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<TestForm />, rootElement);
