'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

export default function InquiryForm({ businessId }: { businessId: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      business_id: businessId,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };

    const { error } = await supabase.from('inquiries').insert(data);

    if (error) {
      alert('Something went wrong. Please try again.');
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 p-8 rounded-3xl text-center text-green-800">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-check text-2xl"></i>
        </div>
        <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
        <p>Thank you for your inquiry. We will get back to you soon.</p>
        <button onClick={() => setSuccess(false)} className="mt-6 text-sm font-bold underline">Send another message</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
           <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Full Name</label>
           <input name="name" required className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all" />
        </div>
        <div>
           <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Email Address</label>
           <input name="email" type="email" required className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all" />
        </div>
      </div>
      <div>
         <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Message</label>
         <textarea name="message" required rows={4} className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all resize-none"></textarea>
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full btn-primary py-5 rounded-2xl text-white font-bold text-lg shadow-xl hover:shadow-primary-200 transition-all disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Inquiry'} <i className="fas fa-paper-plane ml-2"></i>
      </button>
    </form>
  );
}
