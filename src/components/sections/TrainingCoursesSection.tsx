import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/animations/Reveal';
import { Target, ShieldCheck, Settings, ArrowRight } from 'lucide-react';

export const TrainingCoursesSection = () => {
  const courses = [
    {
      id: 'pistol-training',
      title: 'Pistol Range Training',
      price: '$150',
      imageUrl: '/training-pistol.png',
      icon: Target,
      color: 'from-blue-500 to-cyan-400',
      description: 'Master handgun handling, safety, and precision shooting with hands-on instruction tailored for all skill levels.',
    },
    {
      id: 'child-safety',
      title: 'Child Safety Course',
      price: '$100',
      imageUrl: '/training-child-safety.png',
      icon: ShieldCheck,
      color: 'from-purple-500 to-pink-500',
      description: 'Age-appropriate firearm safety education for young learners, focusing on responsibility and awareness.',
    },
    {
      id: 'gun-cleaning',
      title: 'Gun Cleaning Course',
      price: '$50',
      imageUrl: '/training-gun-cleaning.png',
      icon: Settings,
      color: 'from-emerald-500 to-teal-400',
      description: 'Essential techniques for maintaining performance and longevity through proper disassembly and lubrication.',
    },
  ];

  return (
    <section className="bg-white py-24 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Reveal direction="down">
            <span className="text-plra-accent-purple font-black uppercase tracking-widest text-sm mb-4 block">Professional Programs</span>
          </Reveal>
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-black text-plra-black mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-purple to-plra-accent-pink">Training Courses</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course, index) => (
            <Reveal key={course.id} delay={index * 0.1} direction="up">
              <Card className="group bg-white border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden h-full flex flex-col">
                <div className="relative w-full h-64 overflow-hidden">
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-plra-black/80 via-plra-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-white shadow-lg`}>
                      <course.icon size={24} />
                    </div>
                    <span className="text-white font-black text-xl">{course.price}</span>
                  </div>
                </div>
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-2xl font-black text-plra-black group-hover:text-plra-accent-purple transition-colors leading-tight">
                    {course.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 flex-grow flex flex-col justify-between">
                  <p className="text-gray-500 leading-relaxed mb-8">
                    {course.description}
                  </p>
                  <Button className="w-full bg-plra-bg-soft hover:bg-plra-black hover:text-white text-plra-black font-black py-7 rounded-2xl transition-all border-none group/btn">
                    Enroll Now <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={18} />
                  </Button>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};