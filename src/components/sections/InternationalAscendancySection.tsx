import React from 'react';
import { Trophy, Flag, Medal, Globe, Star, Award } from 'lucide-react';
import { Reveal } from '@/components/animations/Reveal';
import { cn } from '@/lib/utils';

export const InternationalAscendancySection = () => {
  const achievements = [
    {
      year: '2023',
      title: 'International Breakthrough',
      subtitle: '6th F Class World Championships',
      icon: Trophy,
      color: 'from-blue-500 to-cyan-400',
      details: [
        'Earned international acclaim for skill and sportsmanship.',
        'Debut with impressive 5th position globally.',
        'European F Class Championships: Won International Rutland Team Cup (Gold).',
        'Individual Medals: 2x Gold, 4x Silver, 1x Bronze.',
      ],
    },
    {
      year: '2024',
      title: 'European Dominance',
      subtitle: 'European F Class Championships (UK)',
      icon: Flag,
      color: 'from-purple-500 to-pink-500',
      details: [
        'International Rutland Team Cup – Team Bronze Medal.',
        'Individual Medals: 3x Gold, 5x Silver, 5x Bronze.',
        'Set 2 new GB F-Class Records.',
        'Solidified position as a top-tier international contender.',
      ],
    },
    {
      year: '2025',
      title: 'Global Supremacy',
      subtitle: 'South African Open Championship',
      icon: Medal,
      color: 'from-plra-gold to-orange-500',
      details: [
        'Defeated South Africa on home turf in both Team Events.',
        'Vice President Team FTR Match: Gold Medal (97.3% accuracy).',
        'Chairman’s Team FTR Match: Gold Medal (98% accuracy).',
        'Individual Events: 13 medals total (5x Gold, 3x Silver, 5x Bronze).',
      ],
    },
  ];

  return (
    <section className="bg-white py-24 px-4 md:px-8 relative overflow-hidden">
      {/* Subtle Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-plra-accent-purple/5 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-plra-accent-pink/5 rounded-full blur-[120px] -z-10"></div>

      <div className="container mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <Reveal direction="down">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-[1px] w-12 bg-plra-accent-purple/30"></div>
              <span className="text-plra-accent-purple font-black uppercase tracking-[0.4em] text-xs">Global Recognition</span>
              <div className="h-[1px] w-12 bg-plra-accent-purple/30"></div>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <h2 className="text-4xl md:text-6xl font-black text-plra-black mb-8 leading-tight">
              Pakistan FTR Team's <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-purple via-plra-accent-pink to-plra-gold">International Ascendancy</span>
            </h2>
          </Reveal>
          <Reveal delay={0.5}>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
              From a stunning debut to absolute dominance, witness the journey of Pakistan's elite marksmen as they conquer the world's most prestigious ranges.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {achievements.map((item, index) => (
            <Reveal key={index} delay={index * 0.2} direction="up">
              <div className="group relative h-full">
                {/* Card Glow Effect - Softer for light theme */}
                <div className={cn("absolute -inset-0.5 rounded-[2.5rem] opacity-10 group-hover:opacity-30 blur-xl transition duration-500 bg-gradient-to-r", item.color)}></div>
                
                <div className="relative h-full bg-plra-bg-soft border border-gray-100 rounded-[2.5rem] p-10 flex flex-col hover:bg-white hover:shadow-2xl transition-all duration-500">
                  <div className="flex justify-between items-start mb-8">
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br", item.color)}>
                      <item.icon size={32} />
                    </div>
                    <span className="text-4xl font-black text-gray-200 group-hover:text-gray-300 transition-colors">{item.year}</span>
                  </div>

                  <h3 className="text-2xl font-black text-plra-black mb-2 group-hover:text-plra-accent-purple transition-colors">{item.title}</h3>
                  <p className="text-plra-accent-pink font-bold text-sm uppercase tracking-widest mb-8">{item.subtitle}</p>

                  <ul className="space-y-4 flex-grow">
                    {item.details.map((detail, dIndex) => (
                      <li key={dIndex} className="flex items-start gap-3 text-gray-600 group-hover:text-gray-700 transition-colors">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-plra-gold flex-shrink-0"></div>
                        <span className="text-sm leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                          <Star size={12} className="text-plra-gold" />
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Elite Performance</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.8} direction="up">
          <div className="mt-20 p-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
          <div className="mt-12 flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-3">
              <Globe className="text-plra-black" size={24} />
              <span className="text-plra-black font-bold tracking-widest text-xs uppercase">ICFRA Affiliated</span>
            </div>
            <div className="flex items-center gap-3">
              <Award className="text-plra-black" size={24} />
              <span className="text-plra-black font-bold tracking-widest text-xs uppercase">World Class Standards</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};