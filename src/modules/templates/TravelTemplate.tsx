'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import BookingForm from '@/modules/landing/BookingForm';
import InquiryForm from '@/modules/landing/InquiryForm';
import { formatPriceRange } from '@/lib/format';

interface TravelTemplateProps {
  business: any;
  services: any[];
  bookingLimitReached: boolean;
  paymentSettings?: any | null;
}

export default function TravelTemplate({
  business,
  services,
  bookingLimitReached,
  paymentSettings,
}: TravelTemplateProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);

    const revealObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add('active'),
        ),
      { threshold: 0.15 },
    );
    document
      .querySelectorAll('.reveal')
      .forEach((el) => revealObserver.observe(el));

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      revealObserver.disconnect();
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Book', href: '#book' },
    { name: 'Contact', href: '#contact' },
  ];

  const heroImage = business.logo_url || '/images/hero.png';

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
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={business.logo_url || '/images/logo.jpg'}
                    alt={`${business.name} Logo`}
                    fill
                    sizes="40px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="hidden sm:block">
                  <h1
                    className={`font-bold text-lg leading-tight transition-colors ${
                      isScrolled ? 'text-gray-800' : 'text-white'
                    }`}
                  >
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
                    isScrolled
                      ? 'text-gray-700 hover:text-primary-600'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.name}
                </a>
              ))}
              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="btn-primary px-5 py-2.5 rounded-full text-white font-semibold text-sm inline-flex items-center gap-2"
                >
                  <i className="fas fa-phone" /> Call Now
                </a>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 transition-colors ${
                  isScrolled ? 'text-gray-800' : 'text-white'
                }`}
                aria-label="Open menu"
              >
                <i
                  className={`fas ${
                    isMobileMenuOpen ? 'fa-times' : 'fa-bars'
                  } text-xl`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100 transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
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
      <section
        id="home"
        className="relative min-h-screen flex items-center mesh-bg hero-pattern overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left reveal active">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-widest mb-6">
                Welcome to {business.name}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
                Your Journey
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">
                  Begins Here
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {business.tagline ||
                  `Discover the world with ${business.name}. We craft unforgettable travel experiences tailored just for you.`}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="#book"
                  className="btn-primary px-8 py-4 rounded-full text-white font-semibold text-lg inline-flex items-center justify-center gap-3"
                >
                  <i className="fas fa-calendar-alt" /> Book Now
                </a>
                <a
                  href="#services"
                  className="btn-secondary px-8 py-4 rounded-full text-white font-semibold text-lg inline-flex items-center justify-center gap-3"
                >
                  <i className="fas fa-compass" /> Explore Services
                </a>
              </div>

              {/* Trust strip */}
              <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-bold text-white">500+</p>
                  <p className="text-xs text-white/70 uppercase tracking-wider">Happy Clients</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-bold text-white">50+</p>
                  <p className="text-xs text-white/70 uppercase tracking-wider">Destinations</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-bold text-white">5★</p>
                  <p className="text-xs text-white/70 uppercase tracking-wider">Rated</p>
                </div>
              </div>
            </div>

            {/* RIGHT-SIDE HERO VISUAL */}
            <div className="hidden lg:block reveal active">
              <div className="relative">
                {/* Big featured image */}
                <div className="relative h-[520px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-white/20">
                  <Image
                    src={heroImage}
                    alt="Featured"
                    fill
                    sizes="(max-width: 1024px) 0vw, 50vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Floating stat card — top right */}
                <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 max-w-[220px] float-anim">
                  <div className="w-12 h-12 rounded-xl bg-accent-100 text-accent-600 flex items-center justify-center text-xl flex-shrink-0">
                    <i className="fas fa-star" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">
                      Trusted by 500+
                    </p>
                    <p className="text-xs text-gray-500">happy travelers</p>
                  </div>
                </div>

                {/* Floating booking card — bottom left */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 max-w-[260px]">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center text-xl flex-shrink-0">
                    <i className="fas fa-shield-alt" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">
                      Secure Booking
                    </p>
                    <p className="text-xs text-gray-500">
                      GCash · Maya · Bank · Cash
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal">
            <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider">
              What We Offer
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 mb-6">
              Our Services
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Tap any service to see what&apos;s included. Prices are estimates —
              the final quote depends on your dates and group size.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {services?.map((service: any, index: number) => (
              <ServiceCard
                key={service.id}
                image={
                  service.image_url || `/images/service_tours.png`
                }
                title={service.name}
                desc={service.description}
                priceLabel={formatPriceRange(
                  service.price_min,
                  service.price_max,
                  service.price,
                )}
                colorClass={
                  index % 2 === 0 ? 'bg-primary-500/80' : 'bg-accent-500/80'
                }
                delay={`${index * 100}ms`}
              />
            ))}
          </div>
          {services?.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <i className="fas fa-suitcase-rolling text-5xl mb-4 block opacity-30" />
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
              <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider">
                About Us
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-6">
                Your Trusted Travel Partner
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                {business.about ||
                  `${business.name} is dedicated to making your dream trips a reality. With years of experience in crafting personalized travel experiences, we handle everything from flights and hotels to visas and travel insurance.`}
              </p>
              <div className="grid sm:grid-cols-3 gap-6 mt-10">
                {[
                  { icon: 'fa-plane', label: 'Flight Booking' },
                  { icon: 'fa-hotel', label: 'Hotel Deals' },
                  { icon: 'fa-passport', label: 'Visa Assistance' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="text-center p-6 bg-gray-50 rounded-2xl"
                  >
                    <i
                      className={`fas ${item.icon} text-2xl text-primary-600 mb-3 block`}
                    />
                    <p className="font-bold text-gray-800 text-sm">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal relative h-80 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/about.png"
                alt="Travel"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* BOOK A SERVICE — standalone section */}
      <section
        id="book"
        className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 reveal">
            <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider">
              Reserve your spot
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 mb-4">
              Book a Service
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Pick a service, tell us when, and we&apos;ll confirm your booking by
              email together with our secure payment options.
            </p>
          </div>

          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 reveal">
            <div className="grid lg:grid-cols-5">
              {/* LEFT: rich green panel for Book a Service */}
              <div className="lg:col-span-2 bg-gradient-to-br from-primary-700 to-primary-900 p-8 sm:p-12 text-white relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10 hero-pattern"
                  aria-hidden
                />
                <div className="relative z-10">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                    Why book with{' '}
                    <span className="text-accent-400">{business.name}</span>?
                  </h3>
                  <p className="text-primary-100/80 mb-8 max-w-sm">
                    Real people, real itineraries, real support — from the moment
                    you submit a request to the day you come home.
                  </p>

                  <ul className="space-y-5">
                    {[
                      {
                        icon: 'fa-bolt',
                        title: 'Fast confirmation',
                        text: 'We reply to booking requests within a few hours.',
                      },
                      {
                        icon: 'fa-shield-alt',
                        title: 'Safe payments',
                        text: 'Pay via GCash, Maya, or bank transfer — your choice.',
                      },
                      {
                        icon: 'fa-headset',
                        title: 'Personal support',
                        text: 'Talk to a real human, not a chatbot, before & after.',
                      },
                      {
                        icon: 'fa-thumbs-up',
                        title: 'Flexible plans',
                        text: 'Reschedule or adjust your booking with ease.',
                      },
                    ].map((b) => (
                      <li key={b.title} className="flex gap-4">
                        <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0 ring-1 ring-white/20">
                          <i className={`fas ${b.icon} text-accent-300`} />
                        </div>
                        <div>
                          <p className="font-bold">{b.title}</p>
                          <p className="text-primary-100/75 text-sm">{b.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10 pt-8 border-t border-white/15">
                    <p className="text-xs uppercase tracking-widest text-primary-200/80 font-semibold mb-2">
                      Operating hours
                    </p>
                    <p className="text-white/90">Mon – Sat · 9:00 AM – 7:00 PM</p>
                    <p className="text-primary-200/70 text-sm">
                      Sundays by appointment
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT: the booking form only */}
              <div className="lg:col-span-3 p-8 sm:p-12 md:p-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Tell us about your trip
                </h3>
                <p className="text-gray-500 mb-8">
                  Fields marked with an asterisk are required.
                </p>
                <BookingForm
                  businessId={business.id}
                  services={services}
                  isLimitReached={bookingLimitReached}
                  paymentSettings={paymentSettings}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT US — standalone section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 reveal">
            <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider">
              We&apos;d love to hear from you
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Have a question, or planning a custom trip? Send us a message and
              we&apos;ll get back to you soon.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 reveal">
            {/* Contact info card */}
            <div className="bg-gradient-to-br from-primary-700 to-primary-900 text-white rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-10 hero-pattern"
                aria-hidden
              />
              <div className="relative z-10 space-y-6">
                <h3 className="text-2xl font-bold">Get in touch</h3>

                {business.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 ring-1 ring-white/20 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-map-marker-alt" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-primary-200/80 font-semibold">
                        Address
                      </p>
                      <p className="text-white/90">{business.address}</p>
                    </div>
                  </div>
                )}

                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="flex items-start gap-4 hover:text-accent-300 transition-colors"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white/10 ring-1 ring-white/20 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-phone" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-primary-200/80 font-semibold">
                        Phone
                      </p>
                      <p className="text-white/90">{business.phone}</p>
                    </div>
                  </a>
                )}

                {business.email && (
                  <a
                    href={`mailto:${business.email}`}
                    className="flex items-start gap-4 hover:text-accent-300 transition-colors"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white/10 ring-1 ring-white/20 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-envelope" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-primary-200/80 font-semibold">
                        Email
                      </p>
                      <p className="text-white/90 break-all">{business.email}</p>
                    </div>
                  </a>
                )}

                <div className="pt-6 border-t border-white/15">
                  <p className="text-xs uppercase tracking-widest text-primary-200/80 font-semibold mb-3">
                    Follow us
                  </p>
                  <div className="flex gap-3">
                    {[
                      { icon: 'fa-facebook-f', href: business.facebook_url },
                      { icon: 'fa-instagram', href: business.instagram_url },
                      { icon: 'fa-tiktok', href: business.tiktok_url },
                    ]
                      .filter((s) => s.href)
                      .map((s) => (
                        <a
                          key={s.icon}
                          href={s.href as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl bg-white/10 ring-1 ring-white/20 flex items-center justify-center hover:bg-accent-500 hover:ring-accent-500 transition-colors"
                        >
                          <i className={`fab ${s.icon}`} />
                        </a>
                      ))}
                    {!business.facebook_url &&
                      !business.instagram_url &&
                      !business.tiktok_url && (
                        <p className="text-primary-200/70 text-sm">
                          Add your social links in Settings to show them here.
                        </p>
                      )}
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry form card */}
            <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-xl p-8 sm:p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Send us a message
              </h3>
              <p className="text-gray-500 mb-8">
                We typically reply within one business day.
              </p>
              <InquiryForm businessId={business.id} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {business.name}. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Powered by{' '}
            <span className="text-primary-400 font-bold">mywebpages</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

const ServiceCard = ({
  image,
  title,
  desc,
  priceLabel,
  colorClass,
  delay = '0ms',
}: {
  image: string;
  title: string;
  desc?: string;
  priceLabel?: string;
  colorClass: string;
  delay?: string;
}) => (
  <div
    className="group relative h-[420px] rounded-3xl overflow-hidden reveal shadow-lg card-hover bg-gray-100"
    style={{ transitionDelay: delay }}
  >
    <Image
      src={image}
      alt={title}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      className="object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end">
      <div
        className={`w-12 h-12 rounded-2xl ${colorClass} backdrop-blur-md flex items-center justify-center text-white text-xl mb-4`}
      >
        <i className="fas fa-suitcase" />
      </div>
      <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
      {priceLabel && (
        <p className="inline-flex items-center gap-1.5 text-accent-300 font-bold text-sm mb-2">
          <i className="fas fa-tag text-[10px]" /> {priceLabel}
        </p>
      )}
      {desc && (
        <p className="text-white/80 text-sm leading-relaxed line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {desc}
        </p>
      )}
    </div>
  </div>
);
