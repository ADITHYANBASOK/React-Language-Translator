import { languages } from '../data/languages';

const LanguageSelect = ({ value, onChange, className }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`block w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-white ${className}`}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelect;