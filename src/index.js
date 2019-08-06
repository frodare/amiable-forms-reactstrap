import React from "react";
import ReactDOM from "react-dom";
import { Form, useField, useForm } from "amiable-forms";
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
  const { inputProps, valid, error, touched } = useField({
    name,
    validators,
    parse,
    format
  });
  const invalidFlag = touched && !valid ? true : undefined;
  const validFlag = touched && valid ? true : undefined;
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
  const { onSubmit, clear } = useForm();
  return (
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
  );
};

const required = v => (v !== 0 && !v ? "Required" : null);
const minLength = l => v => (v || "").length < l;
const validEmail = v =>
  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)
    ? undefined
    : "invalid email address";

const processForm = values => console.log("form processed", values);

const TestForm = () => (
  <Container>
    <h1>amiable-forms</h1>
    <p>An example of an amiable-form created with reactstrap.</p>
    <Form process={processForm}>
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
    </Form>
  </Container>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<TestForm />, rootElement);
