'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Phone, Clock, DollarSign, Truck, Star, ArrowLeft, Navigation } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/ContactForm";

type LocationPageClientProps = {
  locationName: string;
  region: string;
  suburbs: string[];
  landmarks: string[];
  description: string;
  mapUrl: string;
  coordinates: { lat: number; lng: number };
};

export const LocationPageClient = ({
  locationName,
  region,
  suburbs,
  landmarks,
  description,
  mapUrl,
  coordinates,
}: LocationPageClientProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "suburbs" | "contact">("overview");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    "Cash for Cars",
    "Cash for Trucks",
    "Cash for Utes",
    "Cash for 4x4s",
    "Cash for Vans",
    "Scrap Car Removal",
    "Unwanted Car Removal",
    "Old Car Removal",
    "Damaged Car Removal",
    "Accident Car Removal",
  ];

  const benefits = [
    { icon: DollarSign, title: "Top Cash Offers", desc: "Up to $30,000 paid instantly" },
    { icon: Truck, title: "Free Towing", desc: "Complimentary pickup service" },
    { icon: Clock, title: "Same Day Service", desc: "Quick 2-hour response time" },
    { icon: Star, title: "5-Star Rated", desc: "Trusted by 5000+ customers" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-orange-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/#locations"
            className="flex items-center space-x-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to All Locations</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cash For Cars in {locationName}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Sydney's #1 car buying service in {locationName}. Fast, fair, and hassle-free.
            Get cash for your vehicle today!
          </p>
        </div>
      </div>

      {/* Quick Contact Bar */}
      <div className="bg-secondary text-white py-4 px-4 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <MapPin className="w-5 h-5 text-accent" />
            <span className="font-semibold">Servicing {locationName} & Surrounding Areas</span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="tel:0420587575"
              className="flex items-center space-x-2 hover:text-accent transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="font-bold">0420 587 575</span>
            </a>
            <Button
              onClick={() => setActiveTab("contact")}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              Get Quote
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-4 px-6 font-semibold transition-all ${
              activeTab === "overview"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("suburbs")}
            className={`pb-4 px-6 font-semibold transition-all ${
              activeTab === "suburbs"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Suburbs
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`pb-4 px-6 font-semibold transition-all ${
              activeTab === "contact"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Get Quote
          </button>
        </div>

        {/* Tab Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Map */}
                <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map of ${locationName}`}
                  ></iframe>
                  <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span className="font-semibold">{locationName}</span>
                      </div>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                      >
                        <Navigation className="w-4 h-4" />
                        <span className="text-sm font-semibold">Open in Google Maps</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-3xl font-bold text-secondary mb-4">
                    About Our Service in {locationName}
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {description}
                  </p>
                </div>

                {/* Services */}
                <div>
                  <h2 className="text-3xl font-bold text-secondary mb-6">
                    Our Services in {locationName}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {services.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-gray-700 font-medium">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Landmarks */}
                <div>
                  <h2 className="text-3xl font-bold text-secondary mb-6">
                    Landmarks & Areas We Cover
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {landmarks.map((landmark, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg"
                      >
                        <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-gray-700">{landmark}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "suburbs" && (
              <div>
                <h2 className="text-3xl font-bold text-secondary mb-6">
                  Suburbs We Service in {region}
                </h2>
                <p className="text-gray-600 mb-8">
                  We provide cash for cars services in the following {suburbs.length} suburbs and surrounding areas in {locationName}:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {suburbs.map((suburb, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-gray-700">{suburb}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div>
                <h2 className="text-3xl font-bold text-secondary mb-6">
                  Get Your Cash Offer Today
                </h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form below to get an instant quote for your vehicle in {locationName}.
                  We typically respond within minutes and can pick up your car within 2 hours.
                </p>
                <ContactForm />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Quick Contact Card */}
              <div className="bg-gradient-to-br from-primary to-orange-600 rounded-2xl p-6 text-white shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Get Cash Today</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-6 h-6" />
                    <div>
                      <p className="text-sm text-white/80">Call Us Now</p>
                      <a href="tel:0420587575" className="text-xl font-bold hover:text-white/90">
                        0420 587 575
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-6 h-6" />
                    <div>
                      <p className="text-sm text-white/80">Open Daily</p>
                      <p className="font-semibold">8:00 AM - 8:00 PM</p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setActiveTab("contact")}
                  variant="secondary"
                  className="w-full mt-6 bg-white text-primary hover:bg-gray-100"
                  size="lg"
                >
                  Get Free Quote
                </Button>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-secondary mb-6">
                  Why Choose Us?
                </h3>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-secondary">{benefit.title}</h4>
                          <p className="text-sm text-gray-600">{benefit.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
