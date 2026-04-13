import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { History, TrendingUp, Rocket, Landmark, Globe, Calendar } from 'lucide-react';
import { Reveal } from '@/components/animations/Reveal';

export const HistorySection = () => {
  const historyTimeline = [
    {
      year: '2005',
      title: 'Foundations Laid',
      icon: History,
      details: [
        'Long-Range matches formally began with the **Open National Rifle Series** during the 33rd PARA Central Meet at Jhelum.',
        'The series covered matches up to **1000m**, including F Open, FTR, Sporting Rifle, and Small-Bore F Class.',
      ],
    },
    {
      year: '2006–2008',
      title: 'National Integration',
      icon: Globe,
      details: [
        'Big Bore Rifle matches (300m) introduced in NRAP National Shooting Championships.',
        'Held at Karachi, Rawalpindi, and Jhelum, establishing a national footprint.',
      ],
    },
    {
      year: '2009–2011',
      title: 'Skill Building & Regional Growth',
      icon: TrendingUp,
      details: [
        'Formal training in Long-Range shooting started at Jhelum/Tilla Ranges.',
        'Sniper training and classification conducted by AMU at 960m.',
      ],
    },
    {
      year: '2014–2016',
      title: 'Expansion & Inovation',
      icon: Rocket,
      details: [
        'Introduction of 600m FTR and 1000m Benchrest matches.',
        'Army Firing Competition added 600m & 800yds F Open categories.',
      ],
    },
    {
      year: '2017–2019',
      title: 'Breaking Boundries',
      icon: Landmark,
      details: [
        'Formation of PLRA: The official governing body for F-Class, T-Class, and ELR.',
        'MAJOSC series reached international standards with full spectrum matches.',
      ],
    },
    {
      year: '2021–2022',
      title: 'Institutionalisation & PLRA Formation',
      icon: Landmark,
      details: [
        'Formation of PLRA: The official governing body for F-Class, T-Class, and ELR.',
        'MAJOSC series reached international standards with full spectrum matches.',
      ],
    },
  ];

  return (
    <section className="bg-slate-950 py-24 px-4 md:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Reveal direction="down">
            <span className="text-plra-gold font-black uppercase tracking-widest text-sm mb-4 block">Our Journey</span>
          </Reveal>
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
              A Legacy of <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-gold to-orange-500">Precision</span>
            </h2>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-gray-400 text-lg leading-relaxed">
              From humble beginnings in 2005 to becoming a globally recognized association, our history is defined by relentless passion and institutional support.
            </p>
          </Reveal>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {historyTimeline.map((item, index) => (
              <Reveal key={index} delay={index * 0.1} direction="up">
                <AccordionItem value={`item-${index}`} className="border-none bg-white/5 rounded-3xl overflow-hidden px-6 transition-all hover:bg-white/10">
                  <AccordionTrigger className="hover:no-underline py-6 group">
                    <div className="flex items-center text-left gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-plra-gold/10 flex items-center justify-center text-plra-gold group-hover:scale-110 transition-transform">
                        <item.icon size={28} />
                      </div>
                      <div>
                        <p className="text-plra-gold font-black text-sm tracking-widest mb-1">{item.year}</p>
                        <h3 className="text-xl font-bold text-white">{item.title}</h3>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 pl-20 text-gray-400 text-lg leading-relaxed">
                    <ul className="list-disc space-y-3">
                      {item.details.map((detail, dIndex) => (
                        <li key={dIndex}>{detail}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Reveal>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};