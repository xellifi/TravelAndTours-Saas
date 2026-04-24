import React from 'react';
import Image from 'next/image';
import BookingForm from '@/modules/landing/BookingForm';
import InquiryForm from '@/modules/landing/InquiryForm';
import SocialLinks from '@/components/SocialLinks';
import { readSocialLinks } from '@/lib/socialPlatforms';

export default function FitnessTemplate({ business, services, bookingLimitReached, paymentSettings }: any) {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <section className="relative h-[80vh] flex items-center bg-gray-900 overflow-hidden">
        <Image src="/images/fitness_bg.png" alt="Fitness" fill className="object-cover opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
           <div className="max-w-2xl border-l-[12px] border-primary-600 pl-10 py-4">
              <h1 className="text-7xl font-black uppercase mb-6 italic transform -skew-x-6 text-white">Unleash Your <br />Inner <span className="text-primary-600">Beast</span></h1>
              <p className="text-xl text-gray-300 font-bold mb-10 tracking-tight uppercase">High Performance Training with {business.name}</p>
              <a href="#join" className="bg-primary-600 text-white px-10 py-5 rounded-sm font-black uppercase italic hover:bg-primary-500 transition-all">Start Now</a>
           </div>
        </div>
      </section>

      <section className="py-24 px-8 max-w-7xl mx-auto">
         <h2 className="text-4xl font-black italic uppercase mb-16 text-center border-b-4 border-primary-600 w-fit mx-auto pb-2">Training Programs</h2>
         <div className="grid md:grid-cols-3 gap-8">
            {services.map((s: any) => (
               <div key={s.id} className="bg-gray-50 p-10 border-t-8 border-primary-600 shadow-xl group hover:-translate-y-2 transition-all">
                  <h3 className="text-2xl font-black italic uppercase mb-4">{s.name}</h3>
                  <p className="text-gray-600 mb-8 font-medium">{s.description}</p>
                  <p className="text-3xl font-black text-primary-600">₱{s.price}<span className="text-sm">/mo</span></p>
               </div>
            ))}
         </div>
      </section>

      <section id="join" className="py-24 px-8 bg-gray-900 text-white">
         <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-20">
            <div>
               <h3 className="text-4xl font-black italic uppercase mb-8">Join the Crew</h3>
               <BookingForm businessId={business.id} services={services} isLimitReached={bookingLimitReached} paymentSettings={paymentSettings} />
            </div>
            <div>
               <h3 className="text-4xl font-black italic uppercase mb-8">Ask a Coach</h3>
               <InquiryForm businessId={business.id} />
            </div>
         </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="bg-black text-white py-14 px-8 border-t-4 border-primary-600">
         <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 items-start">
            <div className="md:col-span-2">
               <h3 className="text-3xl font-black italic uppercase mb-3">{business.name}</h3>
               <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-6">Train Hard. Stay Strong.</p>
               <div className="space-y-2 text-gray-300 text-sm">
                 {business.address && <p><i className="fas fa-location-dot text-primary-500 mr-2"></i>{business.address}</p>}
                 {business.phone && <p><a href={`tel:${business.phone}`} className="hover:text-primary-500 transition-colors"><i className="fas fa-phone text-primary-500 mr-2"></i>{business.phone}</a></p>}
                 {business.email && <p><a href={`mailto:${business.email}`} className="hover:text-primary-500 transition-colors"><i className="fas fa-envelope text-primary-500 mr-2"></i>{business.email}</a></p>}
               </div>
            </div>
            <div>
              {(() => {
                const links = readSocialLinks(business.social_links);
                if (links.length === 0) return null;
                return (
                  <div>
                    <p className="text-primary-500 text-xs uppercase tracking-[0.3em] font-black mb-4">Follow the grind</p>
                    <SocialLinks links={links} variant="dark" />
                  </div>
                );
              })()}
            </div>
         </div>
         <p className="text-gray-600 text-xs uppercase tracking-widest text-center mt-12 font-bold">© {new Date().getFullYear()} {business.name}</p>
      </footer>
    </div>
  );
}
