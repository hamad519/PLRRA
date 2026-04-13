"use client";

import React, { useEffect, useState } from 'react';
import { Reveal } from '@/components/animations/Reveal';
import { Target, ShieldCheck, Globe, Award } from 'lucide-react';

export const AboutSectionContent = () => {
  const [intro, setIntro] = useState("");

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.plraIntro) {
          setIntro(data.data.plraIntro);
        }
      });
  }, []);

  return (
    <section className="bg-white py-24 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <Reveal direction="right">
            <div className="space-y-8">
              <span className="text-plra-accent-purple font-black uppercase tracking-widest text-sm block">The Association</span>
              <h2 className="text-4xl md:text-5xl font-black text-plra-black leading-tight">
                Official Governing Body for <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-purple to-plra-accent-pink">Long Range Shooting</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  {intro || "The Pakistan Long Range Rifle Association (PLRA) was established following government approval on 31st August 2022. As the sole representative body affiliated with the International Confederation of Full-Bore Rifle Association (ICFRA), we set the standard for the sport in Pakistan."}
                </p>
                <p>
                  Our mission extends beyond competition; we are dedicated to the management, selection, and rigorous training of Pakistan's national teams. We strive to showcase the exceptional talent of Pakistani marksmen on the world stage while fostering a culture of safety and excellence nationwide.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: Globe, title: "ICFRA Affiliated", text: "The only recognized body in Pakistan for international full-bore matches.", color: "bg-blue-500" },
              { icon: Target, title: "Elite Training", text: "Structured programs designed to produce world-class marksmen.", color: "bg-purple-500" },
              { icon: ShieldCheck, title: "Safety First", text: "Strict adherence to international safety and fair play protocols.", color: "bg-emerald-500" },
              { icon: Award, title: "National Pride", text: "Representing Pakistan at World Championships and global events.", color: "bg-pink-500" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1} direction="up">
                <div className="bg-plra-bg-soft p-8 rounded-[2rem] border border-gray-100 hover:shadow-xl transition-all duration-300 h-full group">
                  <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <item.icon size={24} />
                  </div>
                  <h3 className="text-xl font-black text-plra-black mb-3">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};