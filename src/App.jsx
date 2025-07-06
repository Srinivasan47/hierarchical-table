import React, { useState } from 'react';
import TableRow from './TableRow';

const initial = [
  {
    id: 'electronics',
    label: 'Electronics',
    value: 1500,
    children: [
      { id: 'phones', label: 'Phones', value: 800 },
      { id: 'laptops', label: 'Laptops', value: 700 },
    ],
  },
  {
    id: 'furniture',
    label: 'Furniture',
    value: 1000,
    children: [
      { id: 'tables', label: 'Tables', value: 300 },
      { id: 'chairs', label: 'Chairs', value: 700 },
    ],
  },
];

function cloneRow(row) {
  return {
    ...row,
    original: row.value,
    variance: 0,
    children: row.children?.map(cloneRow) || null,
  };
}

function recalcParent(row) {
  if (!row.children) return row;
  const sum = row.children.reduce((a, c) => a + c.value, 0);
  const variance = ((sum - row.original) / row.original) * 100;
  return { ...row, value: sum, variance };
}

function updateChildValue(parent) {
  const total = parent.children.reduce((a, c) => a + c.value, 0) || 0;
  return {
    ...parent,
    children: parent.children.map(c => {
      const prop = total ? c.value / total : 1 / parent.children.length;
      const newVal = parent.value * prop;
      const variance = ((newVal - c.original) / c.original) * 100;
      return { ...c, value: newVal, variance };
    }),
  };
}

function updateRows(rows, rowId, input, isPercent) {
  return rows.map(row => {
    if (row.id === rowId) {
      const base = row.original;
      const newVal = isPercent ? row.value + row.value * (input / 100) : input;
      const variance = ((newVal - base) / base) * 100;
      const updated = { ...row, value: newVal, variance };
      return row.children ? updateChildValue(updated) : updated;
    }
    if (row.children) {
      const children = updateRows(row.children, rowId, input, isPercent);
      const value = children.reduce((a, c) => a + c.value, 0);
      const variance = ((value - row.original) / row.original) * 100;
      return { ...row, children, value, variance };
    }
    return row;
  });
}

export default function App() {
  const [data, setData] = useState(() => initial.map(cloneRow));

  function onChange(rowId, input, isPercent) {
    const updated = updateRows(data, rowId, input, isPercent).map(recalcParent);
    setData(updated);
  }

  const grandTotal = data.reduce((a, c) => a + c.value, 0);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Hierarchical Allocation Table</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
              <th className="p-3">Label</th>
              <th className="p-3">Value</th>
              <th className="p-3">Input</th>
              <th className="p-3">Allocation %</th>
              <th className="p-3">Allocation Val</th>
              <th className="p-3">Variance %</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <TableRow key={row.id} row={row} onChange={onChange} level={0} />
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-semibold">
              <td className="p-3"><strong>Grand Total</strong></td>
              <td className="p-3"><strong>{grandTotal.toFixed(2)}</strong></td>
              <td colSpan="4"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
