import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Reveal } from '@/components/animations/Reveal';

interface BlogContent {
  id: string;
  slug: string;
  title: string;
  date: string;
  imageUrl: string;
  shortDescription: string;
  content: string;
}

interface SingleBlogContentSectionProps {
  blog: BlogContent;
}

export const SingleBlogContentSection = ({ blog }: SingleBlogContentSectionProps) => {
  return (
    <section className="bg-white py-24 px-4 md:px-8 -mt-20 relative z-30">
      <div className="container mx-auto">
        <Reveal direction="up">
          <Card className="bg-white border-none shadow-[0_50px_100px_rgba(0,0,0,0.08)] rounded-[3rem] overflow-hidden max-w-5xl mx-auto">
            <div className="relative w-full h-[400px] md:h-[600px]">
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                layout="fill"
                objectFit="cover"
                quality={100}
              />
            </div>
            <CardContent className="p-8 md:p-20">
              <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none text-gray-600 leading-relaxed blog-content">
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              </div>
              
              <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-plra-bg-soft flex items-center justify-center text-plra-accent-purple font-black">
                    PL
                  </div>
                  <div>
                    <p className="text-sm font-black text-plra-black">PLRA Editorial Team</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Official Publication</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="px-6 py-3 rounded-xl bg-plra-bg-soft text-gray-500 text-xs font-black uppercase tracking-widest">
                    #Marksmanship
                  </div>
                  <div className="px-6 py-3 rounded-xl bg-plra-bg-soft text-gray-500 text-xs font-black uppercase tracking-widest">
                    #Pakistan
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
};