import React from 'react';
import { MapPin, Clock, Mail, Phone } from 'lucide-react';
import { Reveal } from '@/components/animations/Reveal';
import { cn } from '@/lib/utils';

export const ContactInfoSection = () => {
  const contactDetails = [
    {
      icon: MapPin,
      title: 'Physical Address',
      info: 'Pakistan Long Range Rifle Association C/O Army Marksmanship Unit Jhelum Cantonment',
      color: 'bg-blue-500'
    },
    {
      icon: Clock,
      title: 'Work Hours',
      info: 'Monday to Friday: 7am – 7pm',
      color: 'bg-purple-500'
    },
    {
      icon: Mail,
      title: 'Email Address',
      info: 'plra.pakistan2022@gmail.com',
      color: 'bg-pink-500'
    },
    {
      icon: Phone,
      title: 'Phone Numbers',
      info: '0092-544-620081',
      color: 'bg-emerald-500'
    },
  ];

  return (
    <div className="space-y-6">
      <Reveal direction="left">
        <div className="mb-10">
          <span className="text-plra-accent-purple font-black uppercase tracking-widest text-sm mb-4 block">Information</span>
          <h2 className="text-3xl md:text-4xl font-black text-plra-black leading-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-purple to-plra-accent-pink">Contact Details</span>
          </h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {contactDetails.map((detail, index) => (
          <Reveal key={index} delay={index * 0.1} direction="up">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 h-full group">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform", detail.color)}>
                <detail.icon size={24} />
              </div>
              <h3 className="text-lg font-black text-plra-black mb-2">{detail.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{detail.info}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};