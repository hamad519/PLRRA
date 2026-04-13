import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Target, Lightbulb, ShieldCheck, TrendingUp, Eye, Brain, Hand } from 'lucide-react';
import { Reveal } from '@/components/animations/Reveal';

export const TrainingEducationContentSection = () => {
  return (
    <section className="bg-plra-bg-soft py-24 px-4 md:px-8 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-plra-accent-purple/5 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-plra-accent-pink/5 rounded-full blur-[120px] -z-10"></div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Introduction */}
          <div className="lg:col-span-5 space-y-10">
            <Reveal direction="right">
              <div className="space-y-6">
                <span className="text-plra-accent-purple font-black uppercase tracking-widest text-sm block">Knowledge Base</span>
                <h2 className="text-4xl md:text-5xl font-black text-plra-black leading-tight">
                  The Science of <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-purple to-plra-accent-pink">Precision</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Long-range shooting is as much a mental discipline as it is a physical one. Understanding the variables that affect a bullet's flight is the first step toward mastery.
                </p>
              </div>
            </Reveal>

            <Reveal direction="right" delay={0.2}>
              <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-plra-gold/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-plra-gold flex items-center justify-center text-slate-950 mb-6">
                    <Target size={28} />
                  </div>
                  <h3 className="text-2xl font-black mb-4">What is Long-Range?</h3>
                  <p className="text-gray-400 leading-relaxed">
                    It's the art of hitting targets at distances typically over 300 yards. It requires patience, ballistics knowledge, and high-end equipment.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Detailed Basics */}
          <div className="lg:col-span-7">
            <Reveal direction="left">
              <Card className="bg-white border-none shadow-xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-10 bg-white border-b border-gray-100">
                  <CardTitle className="text-2xl font-black flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-plra-accent-purple/10 flex items-center justify-center text-plra-accent-purple">
                      <Lightbulb size={20} />
                    </div>
                    The Fundamentals
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-10">
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {[
                      { 
                        icon: Brain, 
                        title: "Ballistics 101", 
                        content: "Learn how gravity (Bullet Drop), wind (Drift), and aerodynamics (Ballistic Coefficient) interact to determine your shot's path." 
                      },
                      { 
                        icon: TrendingUp, 
                        title: "Rifle Selection", 
                        content: "Choosing the right caliber is crucial. We recommend .308 Winchester or 6.5 Creedmoor for those starting their journey." 
                      },
                      { 
                        icon: Eye, 
                        title: "Optics & Scopes", 
                        content: "Understand magnification, MIL vs MOA turrets, and why parallax adjustment is non-negotiable for long-range success." 
                      },
                      { 
                        icon: Hand, 
                        title: "Essential Gear", 
                        content: "Beyond the rifle, you'll need a sturdy bipod, rear shooting bags, and a reliable rangefinder to build a consistent setup." 
                      },
                      { 
                        icon: ShieldCheck, 
                        title: "Safety Protocols", 
                        content: "Safety is our absolute priority. Treat every firearm as loaded and always maintain strict muzzle discipline on the range." 
                      },
                    ].map((item, i) => (
                      <AccordionItem key={i} value={`item-${i}`} className="border-none bg-plra-bg-soft rounded-2xl px-6 overflow-hidden transition-all hover:bg-gray-100">
                        <AccordionTrigger className="hover:no-underline py-6 group">
                          <div className="flex items-center text-left gap-4">
                            <item.icon className="text-plra-accent-purple group-hover:scale-110 transition-transform" size={20} />
                            <span className="text-lg font-bold text-plra-black">{item.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-8 pl-9 text-gray-600 leading-relaxed text-base">
                          {item.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
};