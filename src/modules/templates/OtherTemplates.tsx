import React from 'react';
import Image from 'next/image';
import BookingForm from '@/modules/landing/BookingForm';
import InquiryForm from '@/modules/landing/InquiryForm';
import SocialLinks from '@/components/SocialLinks';
import { readSocialLinks } from '@/lib/socialPlatforms';

export function SalonTemplate({ business, services, bookingLimitReached, paymentSettings }: any) {
  return (
    <div className="bg-[#fdf9f6] text-[#4a4a4a] min-h-screen font-serif">
      <section className="relative h-[90vh] flex items-center justify-center text-center px-8">
         <div className="absolute inset-x-8 top-8 bottom-8 border-[20px] border-white z-0 opacity-50 shadow-2xl"></div>
         <Image src="/images/salon_bg.png" alt="Salon" fill className="object-cover z-[-1] grayscale-[0.2]" />
         <div className="relative z-10 bg-white/80 backdrop-blur-md p-16 rounded-[4rem] border border-white shadow-2xl max-w-3xl">
            <span className="text-[#c5a48a] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Elegance & Care</span>
            <h1 className="text-6xl md:text-7xl font-light italic mb-8">{business.name}</h1>
            <div className="w-12 h-0.5 bg-[#c5a48a] mx-auto mb-10"></div>
            <p className="text-lg leading-relaxed mb-10">Experience the transformation you deserve with our expert aesthetic services and luxury care routines.</p>
            <a href="#book" className="bg-[#c5a48a] text-white px-12 py-5 rounded-full font-bold hover:bg-[#b08d71] transition-all tracking-widest text-sm uppercase">Book Appointment</a>
         </div>
      </section>

      <section className="py-24 px-8 max-w-5xl mx-auto">
         <h2 className="text-4xl font-light italic text-center mb-16">Signature Services</h2>
         <div className="grid md:grid-cols-2 gap-x-20 gap-y-12">
            {services.map((s: any) => (
               <div key={s.id} className="flex flex-col text-center md:text-left">
                  <div className="flex justify-between items-baseline mb-2">
                     <h3 className="text-2xl font-light italic">{s.name}</h3>
                     <span className="text-xl font-bold text-[#c5a48a]">₱{s.price}</span>
                  </div>
                  <p className="text-sm text-gray-400 font-sans tracking-wide leading-relaxed">{s.description}</p>
               </div>
            ))}
         </div>
      </section>

      <section id="book" className="py-24 px-8 bg-white border-t border-[#f7ede4]">
         <div className="max-w-4xl mx-auto space-y-24">
            <div className="text-center">
               <h2 className="text-4xl font-light italic mb-12">Visit the Studio</h2>
               <div className="max-w-xl mx-auto bg-[#fdf9f6] p-10 rounded-[3rem]">
                  <BookingForm businessId={business.id} services={services} isLimitReached={bookingLimitReached} paymentSettings={paymentSettings} />
               </div>
            </div>
            <div className="text-center pt-24 border-t border-[#f7ede4]">
               <h3 className="text-3xl font-light italic mb-8">Service Inquiries</h3>
               <div className="max-w-xl mx-auto">
                  <InquiryForm businessId={business.id} />
               </div>
            </div>
         </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="bg-[#fdf9f6] border-t border-[#f7ede4] py-16 px-8">
         <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-light italic mb-2">{business.name}</h3>
            <div className="w-12 h-0.5 bg-[#c5a48a] mx-auto mb-6"></div>
            <div className="space-y-1.5 text-sm text-gray-500 mb-10">
              {business.address && <p><i className="fas fa-map-marker-alt text-[#c5a48a] mr-2"></i>{business.address}</p>}
              {business.phone && <p><a href={`tel:${business.phone}`} className="hover:text-[#c5a48a] transition-colors"><i className="fas fa-phone text-[#c5a48a] mr-2"></i>{business.phone}</a></p>}
              {business.email && <p><a href={`mailto:${business.email}`} className="hover:text-[#c5a48a] transition-colors"><i className="fas fa-envelope text-[#c5a48a] mr-2"></i>{business.email}</a></p>}
              {business.operating_hours && (
                <p>
                  <i className="fas fa-clock text-[#c5a48a] mr-2"></i>
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
                <div className="pt-8 border-t border-[#f7ede4]">
                  <p className="text-[#c5a48a] text-[10px] uppercase tracking-[0.3em] font-bold mb-5">Connect</p>
                  <div className="flex justify-center">
                    <SocialLinks links={links} variant="light" />
                  </div>
                </div>
              );
            })()}
            <p className="text-gray-400 text-xs mt-10 italic">© {new Date().getFullYear()} {business.name}. All rights reserved.</p>
         </div>
      </footer>
    </div>
  );
}

export function CorporateTemplate({ business, services, bookingLimitReached, paymentSettings }: any) {
  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
         <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
            <span className="font-black text-2xl tracking-tighter text-slate-900">{business.name?.toUpperCase()}</span>
            <a href="#contact" className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold text-sm">Contact Solutions</a>
         </div>
      </nav>

      <section className="pt-40 pb-24 px-8 max-w-7xl mx-auto">
         <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
               <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold mb-6 inline-block">Enterprise Solutions v2.0</span>
               <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[0.9] mb-8 tracking-tighter">Accelerate Your <br />Business <span className="text-blue-600">Growth</span>.</h1>
               <p className="text-xl text-slate-500 leading-relaxed max-w-lg mb-10">Strategic consultancy and professional services tailored for modern enterprises. Partner with experts from {business.name}.</p>
               <div className="flex gap-4">
                  <a href="#services" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold shadow-2xl">Our Expertise</a>
                  <a href="#contact" className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-bold">Free Audit</a>
               </div>
            </div>
            <div className="relative h-[500px] bg-slate-100 rounded-[3rem] overflow-hidden group shadow-2xl">
               <Image src="/images/corp_hero.png" alt="Corporate" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
         </div>
      </section>

      <section id="services" className="py-32 bg-slate-50">
         <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-3xl font-black mb-16">Specialized Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {services.map((s: any) => (
                  <div key={s.id} className="bg-white p-10 rounded-3xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all">
                     <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-xl mb-6">
                        <i className="fas fa-chart-line"></i>
                     </div>
                     <h3 className="text-2xl font-bold mb-4">{s.name}</h3>
                     <p className="text-slate-500 leading-relaxed mb-6">{s.description}</p>
                     <p className="font-bold text-slate-400">Consultation Rate: <span className="text-slate-900">₱{s.price}</span></p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      <section id="contact" className="py-32 px-8 max-w-7xl mx-auto">
         <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white grid lg:grid-cols-2 gap-20">
            <div>
               <h2 className="text-4xl md:text-5xl font-black mb-8">Ready to Optimize?</h2>
               <p className="text-slate-400 text-lg mb-12">Submit your requirements and our lead consultants will analyze your business profile within 24 hours.</p>
               <div className="space-y-6 mb-10">
                  <div className="flex gap-4 items-center">
                     <i className="fas fa-check-circle text-blue-500"></i>
                     <span className="font-bold">ISO 27001 Certified Processes</span>
                  </div>
                  <div className="flex gap-4 items-center">
                     <i className="fas fa-check-circle text-blue-500"></i>
                     <span className="font-bold">Strict NDA & Privacy Policies</span>
                  </div>
               </div>
               <div className="space-y-3 text-slate-300 text-sm">
                 {business.address && <p><i className="fas fa-map-marker-alt text-blue-400 mr-2"></i>{business.address}</p>}
                 {business.phone && <p><a href={`tel:${business.phone}`} className="hover:text-blue-400 transition-colors"><i className="fas fa-phone text-blue-400 mr-2"></i>{business.phone}</a></p>}
                 {business.email && <p><a href={`mailto:${business.email}`} className="hover:text-blue-400 transition-colors"><i className="fas fa-envelope text-blue-400 mr-2"></i>{business.email}</a></p>}
                 {business.operating_hours && (
                   <p>
                     <i className="fas fa-clock text-blue-400 mr-2"></i>
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
                   <div className="mt-10 pt-8 border-t border-white/10">
                     <p className="text-blue-400 text-xs uppercase tracking-[0.3em] font-bold mb-4">Connect</p>
                     <SocialLinks links={links} variant="dark" />
                   </div>
                 );
               })()}
            </div>
            <div className="bg-white p-10 rounded-3xl text-slate-900">
               <InquiryForm businessId={business.id} />
               <div className="mt-8 pt-8 border-t border-slate-100 italic text-sm text-slate-400 text-center">
                  "Leading the way in professional business transformation."
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
