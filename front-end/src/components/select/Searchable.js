import React from 'react';
import Select from 'react-select';
import { useField, ErrorMessage } from 'formik';

const SeachableSelect = ({ label, name, options, ...props }) => {
  const [field, meta, helpers] = useField({ ...props, name: name });
  const { setValue } = helpers;
  console.log(field.value == null)

  const handleChange = (selectedOption) => {
    setValue(selectedOption);
  };

  return (
    <div>
      <label htmlFor={props.id || name}>{label}</label>
      <Select
        {...field}
        {...props}
        isSearchable
        value={field.value || null}
        onChange={handleChange}
        options={options}
      />
    </div>
  );
};

export default SeachableSelect;