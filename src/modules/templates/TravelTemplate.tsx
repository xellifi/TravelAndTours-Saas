'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import BookingForm from '@/modules/landing/BookingForm';
import InquiryForm from '@/modules/landing/InquiryForm';

interface TravelTemplateProps {
  business: any;
  services: any[];
  bookingLimitReached: boolean;
  paymentSettings?: any | null;
}

export default function TravelTemplate({ business, services, bookingLimitReached, paymentSettings }: TravelTemplateProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);

    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.15 }
    );
    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      revealObserver.disconnect();
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <div className="font-sans text-gray-800 antialiased bg-white">
      {/* Navigation */}
      <nav
        id="navbar"
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'glass-nav shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <a href="#" className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
                  <Image
                    src={business.logo_url || '/images/logo.jpg'}
                    alt={`${business.name} Logo`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="hidden sm:block">
                  <h1 className={`font-bold text-lg leading-tight transition-colors ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                    {business.name}
                  </h1>
                </div>
              </a>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`nav-link font-medium text-sm transition-colors ${
                    isScrolled ? 'text-gray-700 hover:text-primary-600' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <a
                href={`tel:${business.phone || ''}`}
                className="btn-primary px-5 py-2.5 rounded-full text-white font-semibold text-sm inline-flex items-center gap-2"
              >
                <i className="fas fa-phone"></i> Call Now
              </a>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 transition-colors ${isScrolled ? 'text-gray-800' : 'text-white'}`}
              >
                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100 transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-gray-800 font-medium hover:bg-primary-50 rounded-lg"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center mesh-bg hero-pattern overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left reveal active">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
                Your Journey<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">
                  Begins Here
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover the world with {business.name}. We craft unforgettable travel experiences tailored just for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#contact" className="btn-primary px-8 py-4 rounded-full text-white font-semibold text-lg inline-flex items-center justify-center gap-3">
                  <i className="fas fa-calendar-alt"></i> Book Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal">
            <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider">What We Offer</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 mb-6">Our Services</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services?.map((service: any, index: number) => (
              <ServiceCard
                key={service.id}
                image={service.image_url || `/images/service_${index % 4}.png`}
                icon={<i className="fas fa-suitcase"></i>}
                title={service.name}
                desc={service.description}
                price={service.price}
                colorClass={index % 2 === 0 ? 'bg-primary-500/80' : 'bg-accent-500/80'}
                delay={`${index * 100}ms`}
              />
            ))}
          </div>
          {services?.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <i className="fas fa-suitcase-rolling text-5xl mb-4 block opacity-30"></i>
              <p>Services will appear here once added by the business owner.</p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider">About Us</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-6">Your Trusted Travel Partner</h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                {business.name} is dedicated to making your dream trips a reality. With years of experience in crafting personalized travel experiences, we handle everything from flights and hotels to visas and travel insurance.
              </p>
              <div className="grid sm:grid-cols-3 gap-6 mt-10">
                {[
                  { icon: 'fa-plane', label: 'Flight Booking' },
                  { icon: 'fa-hotel', label: 'Hotel Deals' },
                  { icon: 'fa-passport', label: 'Visa Assistance' },
                ].map((item) => (
                  <div key={item.label} className="text-center p-6 bg-gray-50 rounded-2xl">
                    <i className={`fas ${item.icon} text-2xl text-primary-600 mb-3 block`}></i>
                    <p className="font-bold text-gray-800 text-sm">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal relative h-80 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero.png"
                alt="Travel"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact / Booking Section */}
      <section id="contact" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gray-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 reveal">
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-2 bg-gradient-to-br from-primary-700 to-primary-900 p-8 sm:p-12 text-white relative">
                <div className="relative z-10">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                    Let&apos;s plan your<br /><span className="text-accent-400">next adventure</span>
                  </h2>
                  <p className="text-primary-100/80 mb-12 max-w-sm">
                    Have a specific destination in mind or need expert advice? Our team is ready to help you every step of the way.
                  </p>
                  {business.phone && (
                    <a href={`tel:${business.phone}`} className="flex items-center gap-3 text-white/80 hover:text-white transition-colors mb-4">
                      <i className="fas fa-phone w-5"></i> {business.phone}
                    </a>
                  )}
                  {business.email && (
                    <a href={`mailto:${business.email}`} className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                      <i className="fas fa-envelope w-5"></i> {business.email}
                    </a>
                  )}
                </div>
              </div>

              <div className="lg:col-span-3 p-8 sm:p-12 md:p-16">
                <div className="space-y-16">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Book a Service</h3>
                    <BookingForm
                      businessId={business.id}
                      services={services}
                      isLimitReached={bookingLimitReached}
                      paymentSettings={paymentSettings}
                    />
                  </div>

                  <div className="pt-16 border-t border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                    <InquiryForm businessId={business.id} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} {business.name}. All rights reserved.</p>
          <p className="text-gray-600 text-xs mt-2">Powered by <span className="text-primary-400 font-bold">mywebpages</span></p>
        </div>
      </footer>
    </div>
  );
}

const ServiceCard = ({ image, icon, title, desc, price, colorClass, delay = '0ms' }: any) => (
  <div className="group relative h-[400px] rounded-3xl overflow-hidden reveal shadow-lg card-hover" style={{ transitionDelay: delay }}>
    <Image src={image} alt={title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 flex flex-col justify-end">
      <div className={`w-12 h-12 rounded-2xl ${colorClass} backdrop-blur-md flex items-center justify-center text-white text-xl mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
      {price && <p className="text-accent-400 font-bold text-sm mb-2">₱{price}</p>}
      <p className="text-white/80 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">{desc}</p>
    </div>
  </div>
);
