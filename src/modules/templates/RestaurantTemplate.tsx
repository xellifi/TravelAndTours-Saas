import React from 'react';
import Image from 'next/image';
import BookingForm from '@/modules/landing/BookingForm';
import InquiryForm from '@/modules/landing/InquiryForm';

export default function RestaurantTemplate({ business, services, bookingLimitReached, paymentSettings }: any) {
  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen font-serif">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center p-8 overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <Image src="/images/restaurant_bg.png" alt="Restaurant bg" fill className="object-cover" />
        <div className="relative z-20 text-center max-w-4xl">
           <span className="text-amber-500 font-bold tracking-[0.3em] uppercase text-sm mb-4 block">Fine Dining Experience</span>
           <h1 className="text-6xl md:text-8xl font-bold mb-8">{business.name}</h1>
           <p className="text-xl text-gray-300 mb-10 leading-relaxed italic">"Taste the passion in every bite, crafted with the finest local ingredients."</p>
           <a href="#booking" className="bg-amber-600 px-10 py-4 rounded-full font-bold hover:bg-amber-700 transition-all">Reserve a Table</a>
        </div>
      </section>

      {/* Menu / Services */}
      <section className="py-32 px-8 bg-[#151515]">
         <div className="max-w-6xl mx-auto text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Our Specialties</h2>
            <div className="w-20 h-1 bg-amber-600 mx-auto"></div>
         </div>
         <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {services.map((s: any) => (
              <div key={s.id} className="flex justify-between items-start border-b border-gray-800 pb-6 group">
                 <div>
                    <h3 className="text-xl font-bold text-amber-500 group-hover:text-amber-400 transition-colors uppercase tracking-widest">{s.name}</h3>
                    <p className="text-gray-500 mt-2 text-sm italic">{s.description}</p>
                 </div>
                 <span className="text-2xl font-bold">₱{s.price}</span>
              </div>
            ))}
         </div>
      </section>

      {/* Forms */}
      <section id="booking" className="py-32 px-8 bg-white text-gray-900">
         <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold">Reservations & Private Dining</h2>
            <p className="text-gray-500 mt-4">Join us for an unforgettable evening. We accommodate special requests and dietary needs.</p>
         </div>
         <div className="grid md:grid-cols-2 gap-16 max-w-4xl mx-auto">
            <div>
               <h3 className="font-bold text-xl mb-6">Table Reservation</h3>
               <BookingForm businessId={business.id} services={services} isLimitReached={bookingLimitReached} paymentSettings={paymentSettings} />
            </div>
            <div className="border-l border-gray-100 pl-16">
               <h3 className="font-bold text-xl mb-6">Event Inquiry</h3>
               <InquiryForm businessId={business.id} />
            </div>
         </div>
      </section>
    </div>
  );
}
