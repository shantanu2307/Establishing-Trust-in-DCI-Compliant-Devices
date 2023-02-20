import React, { useState } from 'react'

export default function LoginForm({ fields, handleSubmit }) {
    // Set states for each field.name in fields and return it to handleSubmit

    const [fieldValues, setFieldValues] = useState({})

    function handleChange(e) {
        setFieldValues({
            ...fieldValues,
            [e.target.name]: e.target.value,
        })
    }

    function handleSubmitButton(e) {
        e.preventDefault()
        handleSubmit(fieldValues)
    }

    return (
        <form>
            {fields.map((field, index) => (
                <div key={index}>
                    <label htmlFor={field.name}>{field.label}</label>
                    <input type={field.type} name={field.name} onChange={handleChange} />
                </div>
            ))}
            <button onClick={handleSubmitButton}>Submit</button>
        </form>
    )
}
