"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface NumberData {
  id: number;
  muharuro: number;
  kifuliiru: string;
  kingereza: string;
  kifaransa: string;
  kiswahili: string;
}

const NumbersManagement: React.FC = () => {
  const [numbers, setNumbers] = useState<NumberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    muharuro: "",
    kifuliiru: "",
    kingereza: "",
    kifaransa: "",
    kiswahili: "",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  useEffect(() => {
    const fetchNumbers = async () => {
      try {
        const { data, error } = await supabase.from("kuharura").select("*");
        if (error) throw error;
        setNumbers(data || []);
      } catch (err) {
        console.error("Error fetching numbers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNumbers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      try {
        const { error } = await supabase
          .from("kuharura")
          .update(form)
          .eq("id", editId);
        if (error) throw error;
        setNumbers((prev) =>
          prev.map((num) =>
            num.id === editId
              ? { ...num, ...form, muharuro: +form.muharuro }
              : num
          )
        );
        setEditId(null);
      } catch (err) {
        console.error("Error updating number:", err);
      }
    } else {
      try {
        const { data, error } = await supabase
          .from("kuharura")
          .insert([{ ...form, muharuro: +form.muharuro }]);
        if (error) throw error;
        setNumbers((prev) => [...prev, ...(data || [])]);
      } catch (err) {
        console.error("Error adding number:", err);
      }
    }
    setForm({
      muharuro: "",
      kifuliiru: "",
      kingereza: "",
      kifaransa: "",
      kiswahili: "",
    });
  };

  const handleEdit = (number: NumberData) => {
    setEditId(number.id);
    setForm({
      muharuro: number.muharuro.toString(),
      kifuliiru: number.kifuliiru,
      kingereza: number.kingereza,
      kifaransa: number.kifaransa,
      kiswahili: number.kiswahili,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from("kuharura").delete().eq("id", id);
      if (error) throw error;
      setNumbers((prev) => prev.filter((num) => num.id !== id));
    } catch (err) {
      console.error("Error deleting number:", err);
    }
  };

  const filteredNumbers = numbers.filter(
    (number) =>
      number.muharuro.toString().includes(searchTerm) || // Search by "umuharuro"
      number.kifuliiru.toLowerCase().includes(searchTerm.toLowerCase()) ||
      number.kingereza.toLowerCase().includes(searchTerm.toLowerCase()) ||
      number.kifaransa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      number.kiswahili.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedNumbers = filteredNumbers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredNumbers.length / itemsPerPage);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Number System Management</h2>

      {/* Form for adding/updating numbers */}
      <div className="p-6 bg-white shadow rounded-lg mb-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Muharuro */}
          <div>
            <label
              htmlFor="muharuro"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Muharuro (Number)
            </label>
            <input
              type="text"
              name="muharuro"
              value={form.muharuro}
              onChange={handleInputChange}
              placeholder="Enter the number"
              id="muharuro"
              className="p-2 border rounded focus:ring-2 focus:ring-blue-400 w-full"
              required
            />
          </div>

          {/* Kifuliiru */}
          <div>
            <label
              htmlFor="kifuliiru"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Kifuliiru
            </label>
            <input
              type="text"
              name="kifuliiru"
              value={form.kifuliiru}
              onChange={handleInputChange}
              placeholder="Enter Kifuliiru translation"
              id="kifuliiru"
              className="p-2 border rounded focus:ring-2 focus:ring-green-400 w-full"
              required
            />
          </div>

          {/* English */}
          <div>
            <label
              htmlFor="kingerza"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              English
            </label>
            <input
              type="text"
              name="kingereza"
              value={form.kingereza}
              onChange={handleInputChange}
              placeholder="Enter English translation"
              id="kingerza"
              className="p-2 border rounded focus:ring-2 focus:ring-yellow-400 w-full"
              required
            />
          </div>

          {/* French */}
          <div>
            <label
              htmlFor="kifaransa"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              French
            </label>
            <input
              type="text"
              name="kifaransa"
              value={form.kifaransa}
              onChange={handleInputChange}
              placeholder="Enter French translation"
              id="kifaransa"
              className="p-2 border rounded focus:ring-2 focus:ring-red-400 w-full"
              required
            />
          </div>

          {/* Swahili */}
          <div>
            <label
              htmlFor="kiswahili"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Swahili
            </label>
            <input
              type="text"
              name="kiswahili"
              value={form.kiswahili}
              onChange={handleInputChange}
              placeholder="Enter Swahili translation"
              id="kiswahili"
              className="p-2 border rounded focus:ring-2 focus:ring-purple-400 w-full"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              {editId ? "Update Number" : "Add Number"}
            </button>
          </div>
        </form>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by number, Kifuliiru, English, French, or Swahili..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      {/* Table for displaying numbers */}
      {loading ? (
        <p>Loading numbers...</p>
      ) : (
        <>
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Muharuro</th>
                <th className="py-2 px-4 border-b text-left">Kifuliiru</th>
                <th className="py-2 px-4 border-b text-left">English</th>
                <th className="py-2 px-4 border-b text-left">French</th>
                <th className="py-2 px-4 border-b text-left">Swahili</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedNumbers.map((number) => (
                <tr key={number.id}>
                  <td className="py-2 px-4 border-b">{number.muharuro}</td>
                  <td className="py-2 px-4 border-b">{number.kifuliiru}</td>
                  <td className="py-2 px-4 border-b">{number.kingereza}</td>
                  <td className="py-2 px-4 border-b">{number.kifaransa}</td>
                  <td className="py-2 px-4 border-b">{number.kiswahili}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEdit(number)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(number.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <p>
              Page {currentPage} of {totalPages}
            </p>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NumbersManagement;
