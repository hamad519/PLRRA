import React from 'react';
import { User, Award, Lightbulb, BookOpen, Crown, Star } from 'lucide-react';
import { Reveal } from '@/components/animations/Reveal';
import { cn } from '@/lib/utils';

export const MajorContributorsSection = () => {
  const contributors = [
    {
      name: 'Mr. Skhawat Ali',
      role: 'Primary Architect',
      icon: User,
      color: 'from-blue-500 to-cyan-400',
      contributions: [
        'Primary architect of all Long-Range matches (2004-2014).',
        'Continued in an advisory capacity after 2014.',
        'Authored and regulated all matches of the MAJOSC series.',
      ],
    },
    {
      name: 'Mr. Junaid Waqas Iqbal',
      role: 'Championship Organizer',
      icon: Award,
      color: 'from-purple-500 to-pink-500',
      contributions: [
        'Took over leadership in 2014.',
        'Introduced 600m and 800-yard matches in PARA Meets.',
        'Consistently organized Long-Range championships.',
      ],
    },
    {
      name: 'Mr. Junaid Ali Zulfiqar',
      role: 'Innovation Leader',
      icon: Lightbulb,
      color: 'from-emerald-500 to-teal-400',
      contributions: [
        'Brought a bold and innovative approach from 2020 onwards.',
        'Contributed greatly to the advancement of the sport.',
      ],
    },
    {
      name: 'Mr. S.M. Adnan',
      role: 'Key Patron & Author',
      icon: BookOpen,
      color: 'from-plra-gold to-orange-500',
      contributions: [
        'Key patron of MAJOSC series and promoter of LR, ELR, ULR.',
        'Authored “Black Magic with Long Range Precision Rifle” (2021).',
      ],
    },
    {
      name: 'Mr. Ahsan Gulrez',
      role: 'President of PLRA',
      icon: Crown,
      color: 'from-red-500 to-rose-400',
      contributions: [
        'Over three decades of unflinching support.',
        'Played critical role in policy-making and promotion.',
      ],
    },
  ];

  return (
    <section className="bg-plra-bg-soft py-24 px-4 md:px-8 relative overflow-hidden">
      {/* Subtle Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-plra-accent-purple/5 rounded-full blur-[150px] -z-10"></div>

      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Reveal direction="down">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-[1px] w-12 bg-plra-accent-pink/30"></div>
              <span className="text-plra-accent-pink font-black uppercase tracking-[0.4em] text-xs">Our Pillars</span>
              <div className="h-[1px] w-12 bg-plra-accent-pink/30"></div>
            </div>
          </Reveal>
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-black text-plra-black mb-8 leading-tight">
              Major <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-purple to-plra-accent-pink">Contributors</span>
            </h2>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-gray-600 text-lg leading-relaxed">
              The success of this remarkable journey is the result of a collective effort — a team of dedicated individuals working together toward a shared vision.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contributors.map((person, index) => (
            <Reveal key={index} delay={index * 0.1} direction="up">
              <div className="group relative h-full">
                {/* Card Glow Effect - Very subtle for light theme */}
                <div className={cn("absolute -inset-0.5 rounded-[2.5rem] opacity-5 group-hover:opacity-20 blur-xl transition duration-500 bg-gradient-to-r", person.color)}></div>
                
                <div className="relative h-full bg-white border border-gray-100 rounded-[2.5rem] p-8 flex flex-col hover:shadow-2xl transition-all duration-500">
                  <div className="flex items-center gap-5 mb-8">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br", person.color)}>
                      <person.icon size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-plra-black group-hover:text-plra-accent-purple transition-colors">{person.name}</h3>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{person.role}</p>
                    </div>
                  </div>

                  <ul className="space-y-4 flex-grow">
                    {person.contributions.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 group-hover:text-gray-700 transition-colors">
                        <div className={cn("mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gradient-to-r", person.color)}></div>
                        <span className="text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end">
                    <Star size={16} className="text-plra-gold/20 group-hover:text-plra-gold transition-colors" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};