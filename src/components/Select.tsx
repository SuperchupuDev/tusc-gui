export type SelectProps<T extends string | number, U extends string> = {
  defaultValue: T;
  disabled?: boolean;
  displayValues?: U[];
  values: T[];
  onChange: (value: T) => unknown;
};

export const Select = <const T extends string | number, const U extends string>({
  defaultValue,
  disabled,
  displayValues,
  onChange,
  values
}: SelectProps<T, U>) => {
  return (
    <select
      defaultValue={defaultValue}
      onChange={event => onChange(values.find(v => v === event.target.value || v === Number(event.target.value))!)}
      disabled={disabled}
    >
      {values.map((value, index) => (
        <option key={index} value={value}>
          {displayValues?.[index] ?? value}
        </option>
      ))}
    </select>
  );
};
