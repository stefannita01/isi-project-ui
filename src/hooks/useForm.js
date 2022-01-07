import { useState } from "react";

/**
 * NOTE: you need to give each form input a "name" attribute for this hook to work.
 *
 * @param {*} initialValues POJO where a key is the name of a form input, and a value is that form's initial value
 * @returns tuple with the form values and a function to update them - standard useState style
 */

export const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);

  return [
    values,
    (e) => {
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
    },
  ];
};
