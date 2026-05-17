import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ShieldCheck, Target, RefreshCcw, AlertTriangle, Settings, CheckCircle, Eye, Bolt, ClipboardList } from 'lucide-react';
import { Reveal } from '@/components/animations/Reveal';

export const RulesRegulationsContentSection = () => {
  return (
    <section className="bg-white py-24 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl space-y-20">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Safety Guidelines */}
          <Reveal direction="right">
            <Card className="bg-plra-bg-soft border-none shadow-sm rounded-[2.5rem] overflow-hidden h-full">
              <CardHeader className="p-10 bg-white border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <ShieldCheck size={24} />
                  </div>
                  <CardTitle className="text-2xl font-black text-plra-black">Safety Protocols</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 md:p-10">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  <AccordionItem value="item-1" className="border-none bg-white rounded-2xl px-6 overflow-hidden transition-all hover:shadow-md">
                    <AccordionTrigger className="hover:no-underline py-6 group">
                      <div className="flex items-center text-left gap-4">
                        <CheckCircle className="text-emerald-500" size={20} />
                        <span className="text-lg font-bold text-plra-black">General Range Safety</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8 pl-9 text-gray-600 leading-relaxed">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /> Always treat every firearm as loaded.</li>
                        <li className="flex items-start gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /> Keep finger off the trigger until ready to shoot.</li>
                        <li className="flex items-start gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /> Always keep muzzle pointed in a safe direction.</li>
                        <li className="flex items-start gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /> Wear ear and eye protection at all times.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="border-none bg-white rounded-2xl px-6 overflow-hidden transition-all hover:shadow-md">
                    <AccordionTrigger className="hover:no-underline py-6 group">
                      <div className="flex items-center text-left gap-4">
                        <RefreshCcw className="text-blue-500" size={20} />
                        <span className="text-lg font-bold text-plra-black">Firing Line Protocols</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8 pl-9 text-gray-600 leading-relaxed">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" /> Do not step forward unless given the "clear" command.</li>
                        <li className="flex items-start gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" /> Never handle firearms while people are downrange.</li>
                        <li className="flex items-start gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" /> Use designated benches or racks when not shooting.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="border-none bg-white rounded-2xl px-6 overflow-hidden transition-all hover:shadow-md">
                    <AccordionTrigger className="hover:no-underline py-6 group">
                      <div className="flex items-center text-left gap-4">
                        <AlertTriangle className="text-amber-500" size={20} />
                        <span className="text-lg font-bold text-plra-black">Emergency Procedures</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8 pl-9 text-gray-600 leading-relaxed">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" /> Report all accidents to a range officer immediately.</li>
                        <li className="flex items-start gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" /> Follow all instructions from range officers without delay.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </Reveal>

          {/* Equipment Standards */}
          <Reveal direction="left">
            <Card className="bg-plra-bg-soft border-none shadow-sm rounded-[2.5rem] overflow-hidden h-full">
              <CardHeader className="p-10 bg-white border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-plra-accent-purple/10 flex items-center justify-center text-plra-accent-purple">
                    <Settings size={24} />
                  </div>
                  <CardTitle className="text-2xl font-black text-plra-black">Equipment Standards</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 md:p-10">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  <AccordionItem value="item-1" className="border-none bg-white rounded-2xl px-6 overflow-hidden transition-all hover:shadow-md">
                    <AccordionTrigger className="hover:no-underline py-6 group">
                      <div className="flex items-center text-left gap-4">
                        <Target className="text-plra-accent-purple" size={20} />
                        <span className="text-lg font-bold text-plra-black">Approved Firearms</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8 pl-9 text-gray-600 leading-relaxed">
                      <p className="mb-4">Only bolt-action and semi-automatic rifles in good working condition are permitted.</p>
                      <div className="p-4 bg-plra-bg-soft rounded-xl border border-gray-100 text-sm font-medium">
                        Note: Handguns and shotguns are not allowed unless part of a special event.
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="border-none bg-white rounded-2xl px-6 overflow-hidden transition-all hover:shadow-md">
                    <AccordionTrigger className="hover:no-underline py-6 group">
                      <div className="flex items-center text-left gap-4">
                        <Eye className="text-plra-accent-pink" size={20} />
                        <span className="text-lg font-bold text-plra-black">Optics Guidelines</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8 pl-9 text-gray-600 leading-relaxed">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-plra-accent-pink shrink-0" /> Scopes must be mounted securely.</li>
                        <li className="flex items-start gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-plra-accent-pink shrink-0" /> Mil-Dot, MOA, or BDC reticles are recommended.</li>
                        <li className="flex items-start gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-plra-accent-pink shrink-0" /> Iron sights are allowed but not recommended for long range.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="border-none bg-white rounded-2xl px-6 overflow-hidden transition-all hover:shadow-md">
                    <AccordionTrigger className="hover:no-underline py-6 group">
                      <div className="flex items-center text-left gap-4">
                        <Bolt className="text-plra-gold" size={20} />
                        <span className="text-lg font-bold text-plra-black">Ammunition Rules</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8 pl-9 text-gray-600 leading-relaxed">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-plra-gold shrink-0" /> Factory and hand-loaded ammunitions are allowed.</li>
                        <li className="flex items-start gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-plra-gold shrink-0" /> No tracers, armor-piercing, or incendiary rounds.</li>
                        <li className="flex items-start gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-plra-gold shrink-0" /> Approved calibers: .223 Rem, .308 Win, 6.5 Creedmoor, etc.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </Reveal>
        </div>

        {/* Final Note */}
        <Reveal direction="up" delay={0.5}>
          <div className="text-center p-12 bg-plra-bg-soft rounded-[3rem] border border-gray-100">
            <ClipboardList className="mx-auto text-plra-gold mb-6" size={48} />
            <h3 className="text-2xl font-black text-plra-black mb-4">Equipment Inspection</h3>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
              Range officers reserve the right to inspect all gear before shooting. Unsafe or unapproved gear will not be allowed on the range to ensure the safety of all participants.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};