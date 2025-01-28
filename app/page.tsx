"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Address = {
  homeNameOrNumber: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
};

type FormValues = {
  givenName: string;
  surname: string;
  email: string;
  phone: string;
  address: Address;
  avatar: FileList | null;
};

type Referral = FormValues & { id: string };

const ReferralBuilder = () => {
  const { register, handleSubmit, watch, reset, setValue } =
    useForm<FormValues>({
      defaultValues: {
        address: {
          homeNameOrNumber: "",
          street: "",
          suburb: "",
          state: "",
          postcode: "",
          country: "",
        },
      },
    });

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const preview = watch();

  useEffect(() => {
    // Fetch referrals from API on component mount
    const fetchReferrals = async () => {
      try {
        const response = await axios.get("/api/referrals");
        setReferrals(response.data);
      } catch (error) {
        console.error("Error fetching referrals:", error);
      }
    };
    fetchReferrals();
  }, []);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (editingId) {
      setReferrals((prev) =>
        prev.map((referral) =>
          referral.id === editingId ? { ...referral, ...data } : referral
        )
      );
      setEditingId(null);
    } else {
      try {
        const response = await axios.post("/api/referrals", data);
        setReferrals((prev) => [...prev, response.data]);
      } catch (error) {
        console.error("Error creating referral:", error);
      }
    }
    reset();
  };

  const handleEdit = (id: string) => {
    const referralToEdit = referrals.find((referral) => referral.id === id);
    if (referralToEdit) {
      // Set values for form fields including nested address fields
      Object.keys(referralToEdit).forEach((key) => {
        if (key === "address") {
          Object.keys(referralToEdit.address).forEach((addrKey) => {
            setValue(
              `address.${addrKey as keyof Address}`,
              referralToEdit.address[addrKey as keyof Address]
            );
          });
        } else {
          setValue(
            key as keyof FormValues,
            referralToEdit[key as keyof FormValues]
          );
        }
      });
      setEditingId(id);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log(id);

      await axios.delete(`/api/referrals/${id}`);
      setReferrals((prev) => prev.filter((referral) => referral.id !== id));
    } catch (error) {
      console.error("Error deleting referral:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
        {/* Form Section */}
        <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-lg p-4">
          <h1 className="text-2xl font-bold mb-4">Referral Builder</h1>
          {/* Form Section */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4">
            {/* Personal Details */}
            <div className="col-span-2 border-b border-gray-300 pb-4">
              <h2 className="text-lg font-bold mb-2">Referral Details</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Given Name
              </label>
              <input
                {...register("givenName", { required: true })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter given name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Surname
              </label>
              <input
                {...register("surname", { required: true })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter surname"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...register("email", { required: true })}
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                {...register("phone", { required: true })}
                type="tel"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter phone number"
              />
            </div>

            {/* Horizontal Divider */}
            <div className="col-span-2 border-b border-gray-300 pb-4 pt-4">
              <h2 className="text-lg font-bold mb-2">Address</h2>
            </div>

            {/* Address Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Home Name OR #
              </label>
              <input
                {...register("address.homeNameOrNumber", { required: true })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Home Name OR #"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Street
              </label>
              <input
                {...register("address.street", { required: true })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Street"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Suburb
              </label>
              <input
                {...register("address.suburb", { required: true })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Suburb"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                {...register("address.state", { required: true })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Postcode
              </label>
              <input
                {...register("address.postcode", { required: true })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Postcode"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                {...register("address.country", { required: true })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Country"
              />
            </div>
            {/* Avatar Upload and Submit Buttons */}
            <div className="col-span-2 flex justify-between items-center mt-4">
              {/* Upload Avatar */}
              <div>
                <input
                  {...register("avatar")}
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                />
                <label
                  htmlFor="avatar-upload"
                  className="block bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition">
                  Upload Avatar
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition">
                {editingId ? "Update Referral" : "Create Referral"}
              </button>
            </div>
          </form>
        </div>

        {/* Table Section */}
        <div className="w-full lg:w-1/2 bg-gray-100 shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Referral List</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-2 text-left text-sm font-medium">
                    Given Name
                  </th>
                  <th className="p-2 text-left text-sm font-medium">Surname</th>
                  <th className="p-2 text-left text-sm font-medium">Phone</th>
                  <th className="p-2 text-left text-sm font-medium">Email</th>
                  <th className="p-2 text-center text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral, index) => (
                  <tr
                    key={referral.id}
                    className={index > 0 ? "border-t border-gray-300" : ""}>
                    {/* Given Name */}
                    <td className="p-2 text-sm text-gray-800">
                      {referral.givenName}
                    </td>

                    {/* Surname */}
                    <td className="p-2 text-sm text-gray-800">
                      {referral.surname}
                    </td>

                    {/* Phone */}
                    <td className="p-2 text-sm text-gray-800">
                      {referral.phone}
                    </td>

                    {/* Email */}
                    <td className="p-2 text-sm text-gray-800">
                      <a
                        href={`mailto:${referral.email}`}
                        className="text-blue-500 hover:underline">
                        {referral.email}
                      </a>
                    </td>

                    {/* Actions */}
                    <td className="p-2 text-center">
                      <button
                        className="text-blue-500 hover:text-blue-700 mx-1"
                        onClick={() => handleEdit(referral.id)}
                        title="Edit">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487c.292-.293.76-.293 1.052 0l1.599 1.599c.292.293.292.76 0 1.052L8.354 18.297a1.5 1.5 0 01-.53.353l-4.197 1.498c-.512.183-.985-.29-.802-.803l1.498-4.197c.08-.223.206-.425.353-.53l11.684-11.684z"
                          />
                        </svg>
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 mx-1"
                        onClick={() => handleDelete(referral.id)}
                        title="Delete">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 7.5l-15 15m0-15l15 15"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Preview Row */}
                <tr className="border-t border-gray-300">
                  <td className="p-2 text-sm text-gray-500">
                    {preview.givenName || "N/A"}
                  </td>
                  <td className="p-2 text-sm text-gray-500">
                    {preview.surname || "N/A"}
                  </td>
                  <td className="p-2 text-sm text-gray-500">
                    {preview.phone || "N/A"}
                  </td>
                  <td className="p-2 text-sm text-gray-500">
                    {preview.email || "N/A"}
                  </td>
                  <td className="p-2 text-center text-sm text-gray-500">
                    Preview
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralBuilder;
