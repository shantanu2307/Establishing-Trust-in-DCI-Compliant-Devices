import React, { useRef, useState } from 'react';
import styles from '../styles/card.module.css';

export default function Card(props) {
  const textRef = useRef(null);
  const [field, setField] = useState(null);
  function handleChange() {
    setField(textRef.current.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (field && textRef.current.value !== '') {
      props.handleSubmit(field);
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.card_header}>
        <h3>{props.heading}</h3>
      </div>

      <div className={styles.card_body}>
        <h2 className={styles.hash}>{props.hash}</h2>
        <h3 className={styles.by}>Created by: {props.created_by}</h3>
        <h4 className={styles.at}>Created At: {props.created_at}</h4>
        <h4 className={styles.update}>Updated At: {props.updated_at}</h4>
      </div>

      <div className={styles.card_footer}>
        <input type="text" ref={textRef} onChange={handleChange}></input>
        <button className={styles.button} onSubmit={handleSubmit}>
          Tranfer
        </button>
      </div>
    </div>
  );
}
