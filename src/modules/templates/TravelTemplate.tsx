'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import BookingForm from '@/modules/landing/BookingForm';
import InquiryForm from '@/modules/landing/InquiryForm';
import HeroSlideshow from '@/modules/templates/HeroSlideshow';
import { formatPriceRange } from '@/lib/format';
import SocialLinks from '@/components/SocialLinks';
import { readSocialLinks } from '@/lib/socialPlatforms';

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
  const [activeSection, setActiveSection] = useState('home');

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

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -50% 0px' },
    );
    ['home', 'services', 'about', 'book', 'contact'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      revealObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', icon: 'fa-house' },
    { name: 'Services', href: '#services', icon: 'fa-compass' },
    { name: 'About', href: '#about', icon: 'fa-circle-info' },
    { name: 'Book', href: '#book', icon: 'fa-calendar-check' },
    { name: 'Contact', href: '#contact', icon: 'fa-envelope' },
  ];

  const heroImage = business.logo_url || '/images/hero.png';
  const heroImages: string[] = Array.isArray(business.hero_images)
    ? business.hero_images.filter(Boolean)
    : [];

  return (
    <div className="font-sans text-gray-800 antialiased bg-white overflow-x-hidden pb-16 md:pb-0">
      {/* Navigation */}
      <nav
        id="navbar"
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'glass-nav shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-20">
            <div className="flex items-center">
              <a href="#home" className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={business.logo_url || '/images/logo.jpg'}
                    alt={`${business.name} Logo`}
                    fill
                    sizes="40px"
                    className="object-cover"
                    priority
                  />
                </div>
                <h1
                  className={`font-bold text-sm sm:text-lg leading-tight transition-colors ${
                    isScrolled ? 'text-gray-800' : 'text-white'
                  }`}
                >
                  {business.name}
                </h1>
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

            {/* Mobile CTA — top right (desktop uses inline nav) */}
            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                className={`md:hidden p-2 transition-colors ${
                  isScrolled ? 'text-primary-600' : 'text-white'
                }`}
                aria-label="Call us"
              >
                <i className="fas fa-phone text-lg" />
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom Tab Bar — mobile only */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex">
          {navLinks.map((tab) => {
            const sectionId = tab.href.slice(1);
            const isActive = activeSection === sectionId;
            return (
              <a
                key={tab.name}
                href={tab.href}
                className={`flex-1 flex flex-col items-center justify-center pt-2 pb-1.5 gap-0.5 transition-colors active:scale-95 ${
                  isActive ? 'text-primary-600' : 'text-gray-400'
                }`}
              >
                <i className={`fas ${tab.icon} text-[17px] transition-transform ${isActive ? 'scale-110' : ''}`} />
                <span className={`text-[9px] font-bold tracking-tight ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
                  {tab.name}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 w-8 h-0.5 bg-primary-500 rounded-full hidden" />
                )}
              </a>
            );
          })}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center mesh-bg hero-pattern overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 sm:py-40 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left reveal active">
              <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-4 sm:mb-6">
                Welcome to {business.name}
              </span>

              {/* Mobile-only hero slideshow */}
              <div className="block lg:hidden mb-4 sm:mb-6">
                <HeroSlideshow
                  images={heroImages}
                  fallback={heroImage}
                  className="h-48 sm:h-64"
                />
              </div>

              <h1 className="text-[28px] sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-4 sm:mb-6">
                Your Journey
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">
                  Begins Here
                </span>
              </h1>
              <p className="text-sm sm:text-xl text-white/80 mb-5 sm:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {business.tagline ||
                  `Discover the world with ${business.name}. We craft unforgettable travel experiences tailored just for you.`}
              </p>
              <div className="flex flex-row gap-2.5 sm:gap-4 justify-center lg:justify-start">
                <a
                  href="#book"
                  className="btn-primary flex-1 sm:flex-none px-5 sm:px-8 py-3 sm:py-4 rounded-full text-white font-semibold text-sm sm:text-lg inline-flex items-center justify-center gap-2"
                >
                  <i className="fas fa-calendar-alt" /> Book Now
                </a>
                <a
                  href="#services"
                  className="btn-secondary flex-1 sm:flex-none px-5 sm:px-8 py-3 sm:py-4 rounded-full text-white font-semibold text-sm sm:text-lg inline-flex items-center justify-center gap-2"
                >
                  <i className="fas fa-compass" /> Explore
                </a>
              </div>

              {/* Trust strip */}
              <div className="mt-5 sm:mt-12 grid grid-cols-3 gap-2 sm:gap-4 max-w-xs sm:max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <p className="text-xl sm:text-3xl font-bold text-white">500+</p>
                  <p className="text-[10px] sm:text-xs text-white/70 uppercase tracking-wide">Happy Clients</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-xl sm:text-3xl font-bold text-white">50+</p>
                  <p className="text-[10px] sm:text-xs text-white/70 uppercase tracking-wide">Destinations</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-xl sm:text-3xl font-bold text-white">5★</p>
                  <p className="text-[10px] sm:text-xs text-white/70 uppercase tracking-wide">Rated</p>
                </div>
              </div>
            </div>

            {/* RIGHT-SIDE HERO VISUAL */}
            <div className="hidden lg:block reveal active">
              <div className="relative">
                {/* Big featured image (rotates between owner-uploaded photos) */}
                <HeroSlideshow images={heroImages} fallback={heroImage} />

                {/* Floating stat card — top right */}
                <div className="absolute -top-6 -right-6 z-40 bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 max-w-[220px] float-anim">
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
                <div className="absolute -bottom-6 -left-6 z-40 bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 max-w-[260px]">
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
      <section id="services" className="py-12 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 reveal">
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
      <section id="about" className="py-12 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="reveal">
              <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider">
                About Us
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4 sm:mb-6">
                Your Trusted Travel Partner
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                {business.about ||
                  `${business.name} is dedicated to making your dream trips a reality. With years of experience in crafting personalized travel experiences, we handle everything from flights and hotels to visas and travel insurance.`}
              </p>
              <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-10">
                {[
                  { icon: 'fa-plane', label: 'Flight Booking' },
                  { icon: 'fa-hotel', label: 'Hotel Deals' },
                  { icon: 'fa-passport', label: 'Visa Assistance' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="text-center p-4 sm:p-6 bg-gray-50 rounded-2xl"
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
        className="py-12 sm:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 reveal">
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

          <div className="bg-white rounded-2xl sm:rounded-[3rem] overflow-hidden border border-gray-300 reveal">
            <div className="grid lg:grid-cols-5">
              {/* LEFT: rich green panel for Book a Service */}
              <div className="lg:col-span-2 bg-gradient-to-br from-primary-700 to-primary-900 p-5 sm:p-10 text-white relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10 hero-pattern"
                  aria-hidden
                />
                <div className="relative z-10">
                  <h3 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-4">
                    Why book with{' '}
                    <span className="text-accent-400">{business.name}</span>?
                  </h3>
                  <p className="text-primary-100/80 mb-5 sm:mb-8 max-w-sm text-sm sm:text-base">
                    Real people, real itineraries, real support — from the moment
                    you submit a request to the day you come home.
                  </p>

                  {/* Compact icon badges — mobile only */}
                  <div className="flex flex-wrap gap-2 sm:hidden mb-1">
                    {[
                      { icon: 'fa-bolt', label: 'Fast reply' },
                      { icon: 'fa-shield-alt', label: 'Safe payment' },
                      { icon: 'fa-headset', label: 'Real support' },
                      { icon: 'fa-thumbs-up', label: 'Flexible' },
                    ].map((b) => (
                      <span
                        key={b.label}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 ring-1 ring-white/20 text-xs font-semibold"
                      >
                        <i className={`fas ${b.icon} text-accent-300 text-xs`} />
                        {b.label}
                      </span>
                    ))}
                  </div>

                  {/* Full bullet list — desktop only */}
                  <ul className="hidden sm:block space-y-5">
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

                  {business.operating_hours && (
                    <div className="hidden sm:block mt-10 pt-8 border-t border-white/15">
                      <p className="text-xs uppercase tracking-widest text-primary-200/80 font-semibold mb-2">
                        Operating hours
                      </p>
                      <p className="text-white/90">{business.operating_hours}</p>
                      {business.operating_hours_note && (
                        <p className="text-primary-200/70 text-sm">
                          {business.operating_hours_note}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: the booking form only */}
              <div className="lg:col-span-3 p-5 sm:p-10 md:p-14">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Tell us about your trip
                </h3>
                <p className="text-gray-500 mb-5 sm:mb-8 text-sm sm:text-base">
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
      <section id="contact" className="py-12 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 reveal">
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

          <div className="max-w-3xl mx-auto space-y-8 reveal">
            {/* Inquiry form card */}
            <div className="bg-white border border-gray-300 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-10">
              <div className="text-center mb-5 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Send us a message
                </h3>
                <p className="text-gray-500 text-sm sm:text-base">
                  We typically reply within one business day.
                </p>
              </div>
              <InquiryForm businessId={business.id} />
            </div>

            {/* Contact info card */}
            <div className="bg-gradient-to-br from-primary-700 to-primary-900 text-white rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-10 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-10 hero-pattern"
                aria-hidden
              />
              <div className="relative z-10 space-y-6 text-center">
                <h3 className="text-2xl font-bold">Get in touch</h3>

                {business.address && (
                  <div className="flex items-start gap-4 justify-center text-left">
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
                    className="flex items-start gap-4 justify-center text-left hover:text-accent-300 transition-colors"
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
                    className="flex items-start gap-4 justify-center text-left hover:text-accent-300 transition-colors"
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

                {(() => {
                  const links = readSocialLinks(business.social_links);
                  return (
                    <div className="pt-6 border-t border-white/15">
                      <p className="text-xs uppercase tracking-widest text-primary-200/80 font-semibold mb-3">
                        Follow us
                      </p>
                      {links.length > 0 ? (
                        <SocialLinks links={links} variant="dark" className="justify-center" />
                      ) : (
                        <p className="text-primary-200/70 text-sm">
                          Add your social links from the dashboard to show them
                          here.
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-16">
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
    className="group relative h-60 sm:h-[380px] rounded-3xl overflow-hidden reveal shadow-lg card-hover bg-gray-100"
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
