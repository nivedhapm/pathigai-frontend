import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { ChevronDown } from 'lucide-react';
import '../../../styles/dropdown.css';

// Custom input component for DatePicker
const CustomInput = forwardRef(({ value, onClick, placeholder, disabled, error, className = "" }, ref) => (
  <input
    ref={ref}
    value={value}
    onClick={onClick}
    placeholder={placeholder}
    disabled={disabled}
    readOnly
    className={`${className} ${error ? 'error' : ''}`}
    style={{
      cursor: disabled ? 'not-allowed' : 'pointer'
    }}
  />
));

CustomInput.displayName = 'CustomInput';

// Custom header component for year/month selection
const CustomHeader = ({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 100; i <= currentYear + 10; i++) {
    years.push(i);
  }

  return (
    <div className="react-datepicker__header">
      <button
        type="button"
        className="react-datepicker__navigation react-datepicker__navigation--previous"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
      >
        <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--previous">‹</span>
      </button>
      
      <div className="react-datepicker__current-month-container">
        <select
          value={date.getMonth()}
          onChange={(e) => changeMonth(parseInt(e.target.value))}
          className="react-datepicker__month-select"
        >
          {months.map((month, index) => (
            <option key={month} value={index}>
              {month}
            </option>
          ))}
        </select>
        
        <select
          value={date.getFullYear()}
          onChange={(e) => changeYear(parseInt(e.target.value))}
          className="react-datepicker__year-select"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="react-datepicker__navigation react-datepicker__navigation--next"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
      >
        <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--next">›</span>
      </button>
    </div>
  );
};

const CustomDatePicker = ({ 
  value, 
  onChange, 
  placeholder = "Select date...",
  disabled = false,
  error = false,
  className = "",
  name = "",
  dateFormat = "MM/dd/yyyy",
  minDate = null,
  maxDate = null,
  ...props 
}) => {
  // Handle date change
  const handleDateChange = (date) => {
    if (onChange) {
      // Create synthetic event for onChange
      const syntheticEvent = {
        target: {
          name: name,
          value: date
        }
      };
      onChange(syntheticEvent);
    }
  };

  // Calculate year range for better UX
  const currentYear = new Date().getFullYear();
  const yearRange = `${currentYear - 100}:${currentYear + 10}`;

  return (
    <DatePicker
      selected={value}
      onChange={handleDateChange}
      dateFormat={dateFormat}
      disabled={disabled}
      placeholderText={placeholder}
      minDate={minDate}
      maxDate={maxDate}
      
      // REMOVE default dropdowns and use custom header
      showMonthDropdown={false}
      showYearDropdown={false}
      
      // Use our custom header component
      renderCustomHeader={CustomHeader}
      
      // Consistent calendar size - always show 6 weeks
      fixedHeight
      
      // Custom input styling
      customInput={
        <CustomInput 
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          className={className}
        />
      }
      
      // Popper customization for mobile
      popperClassName="react-datepicker-popper"
      calendarClassName="react-datepicker-calendar"
      popperProps={{
        strategy: 'fixed',
        modifiers: [
          {
            name: 'preventOverflow',
            options: {
              boundary: 'viewport',
            },
          },
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['bottom', 'top'],
            },
          },
        ],
      }}
      
      {...props}
    />
  );
};

export default CustomDatePicker;