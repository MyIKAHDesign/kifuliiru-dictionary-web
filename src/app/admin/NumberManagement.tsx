"use client";

import React from "react";

// Mock data for numbers
const mockNumbers = [
  { id: "1", number: "One", value: 1 },
  { id: "2", number: "Two", value: 2 },
  { id: "3", number: "Three", value: 3 },
  { id: "4", number: "Four", value: 4 },
  { id: "5", number: "Five", value: 5 },
];

const NumbersManagement: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Number System Management</h2>
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Number</th>
            <th className="py-2 px-4 border-b text-left">Value</th>
          </tr>
        </thead>
        <tbody>
          {mockNumbers.map((number) => (
            <tr key={number.id}>
              <td className="py-2 px-4 border-b">{number.number}</td>
              <td className="py-2 px-4 border-b">{number.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NumbersManagement;
