import React from 'react';
import { Reveal } from '@/components/animations/Reveal';
import { CheckCircle2 } from 'lucide-react';

export const MembershipCategoriesSection = () => {
  const categories = [
    "Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan",
    "Islamabad Federal Territory", "Pakistan Army", "Pakistan Navy",
    "Pakistan Air Force", "Provisional Corps HQ", "Civil Armed Forces",
    "Universities Grant Commission"
  ];

  return (
    <section className="bg-plra-bg-soft py-24 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Reveal direction="down">
            <span className="text-plra-accent-purple font-black uppercase tracking-widest text-sm mb-4 block">Join the Ranks</span>
          </Reveal>
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-black text-plra-black mb-8">
              Membership <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-purple to-plra-accent-pink">Categories</span>
            </h2>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-lg text-gray-600 leading-relaxed">
              Membership is open to regions and institutions with direct affiliation to the PSB that have developed Long Range Shooting facilities.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Reveal key={index} delay={index * 0.05} direction="up">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-plra-green-light/10 flex items-center justify-center text-plra-green-light group-hover:bg-plra-green-light group-hover:text-white transition-all">
                  <CheckCircle2 size={20} />
                </div>
                <span className="font-bold text-plra-black">{category}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};