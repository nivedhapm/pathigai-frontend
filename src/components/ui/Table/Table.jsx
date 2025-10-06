import React from 'react';
import './Table.css';

const Table = ({ 
  columns = [], 
  data = [], 
  validCount = 0, 
  invalidCount = 0,
  theme = 'light'
}) => {
  return (
    <div className={`table-container ${theme}`}>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={row.isInvalid ? 'invalid-row' : ''}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>{row[column.accessor]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;