import React from "react";
import ReactDOM from "react-dom";
import { Form, useField, useForm, Debug } from "amiable-forms";
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

const Field = ({ name, label, validators, parse, format, placeholder }) => {
  const { inputProps, valid, error, touched, submitted } = useField({
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
        {...inputProps}
        valid={validFlag}
        invalid={invalidFlag}
        placeholder={placeholder}
      />
      <FormFeedback invalid={invalidFlag}>{error}</FormFeedback>
    </FormGroup>
  );
};

const SubmitButtons = () => {
  const { onSubmit, clear, setValues } = useForm();
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

const required = v => (v !== 0 && !v ? "Required" : null);
const minLength = l => v => (v || "").length < l;
const validEmail = v =>
  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)
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

const TestForm = () => (
  <Container>
    <h1>amiable-forms</h1>
    <p>An example of an amiable-form created with reactstrap.</p>
    <Form process={processForm} processInvalid={processInvalid} initialValues={initialValues}>
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

      <Field
        label="Email"
        name="email"
        placeholder="email"
        validators={[required, validEmail]}
      />
      <SubmitButtons />
      <Debug />
    </Form>
  </Container>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<TestForm />, rootElement);
