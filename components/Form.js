import React, { useState } from 'react';
import styles from '../styles/form.module.css';
import CustomInput from './CustomInput';
import Button from './Button';
import { Alert } from '@mui/material';

export default function LoginForm({ children, error, success, fields, handleSubmit }) {
  // Set states for each field.name in fields and return it to handleSubmit

  const [fieldValues, setFieldValues] = useState({});

  function handleChange(e, name) {
    setFieldValues({
      ...fieldValues,
      [name]: e.target.value,
    });
  }

  function handleSubmitButton(e) {
    e.preventDefault();
    handleSubmit(fieldValues);
  }

  return (
    <form className={styles.form}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      {children && children}
      {fields.map((field, index) => (
        <CustomInput
          key={index}
          name={field.name}
          labelText={field.label}
          type={field.type}
          handleChange={(e) => handleChange(e, field.name)}
          formControlProps={{
            fullWidth: true,
          }}
        />
      ))}
      <Button
        type="button"
        style={{
          backgroundColor: 'black',
          color: 'white',
        }}
        className={styles.form_custom_btn}
        onClick={handleSubmitButton}
      >
        Submit
      </Button>
    </form >
  );
}
