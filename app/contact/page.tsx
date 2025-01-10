'use client'
import React, { useState } from 'react';

interface FormValues {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormValues>({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    validateField(name, value);
  };

  const validateField = (fieldName: string, value: string) => {
    let newErrors = { ...errors };

    switch (fieldName) {
      case 'name':
        if (!value) {
          newErrors.name = 'Name is required';
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          newErrors.email = 'Invalid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'message':
        if (!value) {
          newErrors.message = 'Message is required';
        } else {
          delete newErrors.message;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    validateField('name', formData.name);
    validateField('email', formData.email);
    validateField('message', formData.message);

    if (Object.keys(errors).length === 0) {
      // Handle form submission here, e.g., send data to server
      console.log(formData);
    //   contact-us controller pending
    }
  };

  return (
    <div className="bg-black-900 mt-12 mx-auto w-[50%] h-fit text-white h-screen">
      <div className="container p-11 mx-auto py-16 px-6">
        <h1 className="text-3xl font-bold mb-8">Contact Us</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              placeholder='Mohit kumar'
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 block p-2 h-12 bg-black/50 backdrop-blur-xl w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder='xyz123@gmail.com'
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 p-2 block h-12 bg-black/50 backdrop-blur-xl w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"

            placeholder='issue in progress'
              rows={4}
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="mt-2 p-2 bg-black/50 backdrop-blur-xl block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.message && <p className="text-red-500">{errors.message}</p>}
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;