import React from 'react';
import Image from 'next/image';
import BookingForm from '@/modules/landing/BookingForm';
import InquiryForm from '@/modules/landing/InquiryForm';
import SocialLinks from '@/components/SocialLinks';
import { readSocialLinks } from '@/lib/socialPlatforms';

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

      {/* Footer / Contact */}
      <footer id="contact" className="bg-[#0f0f0f] border-t border-amber-900/30 py-16 px-8">
         <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-3">{business.name}</h3>
            <div className="w-16 h-0.5 bg-amber-600 mx-auto mb-8"></div>
            <div className="space-y-2 text-gray-400 text-sm tracking-wide mb-10">
              {business.address && <p><i className="fas fa-map-marker-alt text-amber-600 mr-2"></i>{business.address}</p>}
              {business.phone && <p><a href={`tel:${business.phone}`} className="hover:text-amber-500 transition-colors"><i className="fas fa-phone text-amber-600 mr-2"></i>{business.phone}</a></p>}
              {business.email && <p><a href={`mailto:${business.email}`} className="hover:text-amber-500 transition-colors"><i className="fas fa-envelope text-amber-600 mr-2"></i>{business.email}</a></p>}
              {business.operating_hours && (
                <p>
                  <i className="fas fa-clock text-amber-600 mr-2"></i>
                  {business.operating_hours}
                  {business.operating_hours_note && (
                    <span className="block text-sm opacity-80 mt-0.5 ml-6">{business.operating_hours_note}</span>
                  )}
                </p>
              )}
            </div>
            {(() => {
              const links = readSocialLinks(business.social_links);
              if (links.length === 0) return null;
              return (
                <div className="border-t border-amber-900/20 pt-8">
                  <p className="text-amber-600 text-xs uppercase tracking-[0.3em] font-bold mb-5">Connect with us</p>
                  <div className="flex justify-center">
                    <SocialLinks links={links} variant="dark" />
                  </div>
                </div>
              );
            })()}
            <p className="text-gray-600 text-xs mt-10">© {new Date().getFullYear()} {business.name}. All rights reserved.</p>
         </div>
      </footer>
    </div>
  );
}
