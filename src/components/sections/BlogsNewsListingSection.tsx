import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { blogs } from '@/lib/blog-data';
import { Reveal } from '@/components/animations/Reveal';

export const BlogsNewsListingSection = () => {
  return (
    <section className="bg-white py-24 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog, index) => (
            <Reveal key={blog.id} delay={index * 0.1} direction="up">
              <Link href={`/blogs-news/${blog.slug}`} passHref>
                <Card className="group bg-plra-bg-soft border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden h-full flex flex-col">
                  <div className="relative w-full h-64 overflow-hidden">
                    <Image
                      src={blog.imageUrl}
                      alt={blog.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-plra-black/80 via-plra-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6">
                      <div className="flex items-center text-white/80 text-[10px] font-black uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                        <CalendarDays size={12} className="mr-2 text-plra-gold" />
                        {blog.date}
                      </div>
                    </div>
                  </div>
                  <CardHeader className="p-8 pb-4 flex-grow">
                    <CardTitle className="text-2xl font-black text-plra-black group-hover:text-plra-accent-purple transition-colors leading-tight">
                      {blog.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <p className="text-gray-500 leading-relaxed mb-8 line-clamp-3">
                      {blog.shortDescription}
                    </p>
                    <div className="flex items-center text-plra-black font-black text-xs uppercase tracking-widest group-hover:text-plra-accent-purple transition-colors">
                      Read Article <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};