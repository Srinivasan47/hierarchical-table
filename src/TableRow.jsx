import React, { useState } from 'react';

const paddingClasses = ['pl-1', 'pl-4', 'pl-8', 'pl-12'];

export default function TableRow({ row, onChange, level }) {
  const [input, setInput] = useState('');

  const indent = paddingClasses[Math.min(level, paddingClasses.length - 1)];

  const handleAllocate = (isPercent) => {
    const value = parseFloat(input);
    if (!isNaN(value)) {
      onChange(row.id, value, isPercent);
      setInput('');
    }
  };

  return (
    <>
      <tr className="border-t border-gray-200 hover:bg-gray-50">
        <td className={`p-3 ${indent}`}>{row.label}</td>
        <td className="p-3">{row.value.toFixed(2)}</td>
        <td className="p-3">
          <input
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            min={0}
            className="w-full px-2 py-1 border text-sm"
            placeholder="Enter value or %"
          />
        </td>
        <td className="p-3">
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded cursor-pointer"
            onClick={() => handleAllocate(true)}
            disabled={input === ''}
          >
            Allocate %
          </button>
        </td>
        <td className="p-3">
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded cursor-pointer"
            onClick={() => handleAllocate(false)}
            disabled={input === ''}
          >
            Allocate Val
          </button>
        </td>
        <td className="p-3">{row.variance.toFixed(2)}%</td>
      </tr>
      {row.children?.map(child => (
        <TableRow
          key={child.id}
          row={child}
          onChange={onChange}
          level={level + 1}
        />
      ))}
    </>
  );
}
