import React from "react";

const AllTemplates = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-gray-100 to-blue-500 px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">All Templates</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + Create Template
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-gray-100 text-gray-600">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Sl No
                </th>
                <th scope="col" className="px-6 py-3">
                  Template Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">1</td>
                <td className="px-6 py-4">Apple MacBook Pro 17"</td>
                <td className="px-6 py-4">
                  <a href="#" className="text-blue-600 hover:underline">
                    Edit
                  </a>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">2</td>
                <td className="px-6 py-4">Microsoft Surface Pro</td>
                <td className="px-6 py-4">
                  <a href="#" className="text-blue-600 hover:underline">
                    Edit
                  </a>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">3</td>
                <td className="px-6 py-4">Magic Mouse 2</td>
                <td className="px-6 py-4">
                  <a href="#" className="text-blue-600 hover:underline">
                    Edit
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllTemplates;
