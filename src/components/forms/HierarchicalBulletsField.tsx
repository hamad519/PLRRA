"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, CornerDownRight } from 'lucide-react';

export type HierarchicalBullet = { text: string; children: string[] };

interface HierarchicalBulletsFieldProps {
  value: HierarchicalBullet[];
  onChange: (next: HierarchicalBullet[]) => void;
  label?: string;
  helperText?: string;
}

export const HierarchicalBulletsField: React.FC<HierarchicalBulletsFieldProps> = ({
  value,
  onChange,
  label = 'Bullet Points',
  helperText = 'Each bullet can optionally contain nested sub-bullets.',
}) => {
  const bullets = Array.isArray(value) ? value : [];

  const updateBullet = (index: number, next: Partial<HierarchicalBullet>) => {
    const copy = bullets.map((b, i) => (i === index ? { ...b, ...next } : b));
    onChange(copy);
  };

  const addBullet = () => onChange([...bullets, { text: '', children: [] }]);
  const removeBullet = (index: number) => onChange(bullets.filter((_, i) => i !== index));

  const addChild = (bulletIndex: number) => {
    const target = bullets[bulletIndex];
    if (!target) return;
    updateBullet(bulletIndex, { children: [...(target.children || []), ''] });
  };

  const updateChild = (bulletIndex: number, childIndex: number, text: string) => {
    const target = bullets[bulletIndex];
    if (!target) return;
    const children = (target.children || []).map((c, i) => (i === childIndex ? text : c));
    updateBullet(bulletIndex, { children });
  };

  const removeChild = (bulletIndex: number, childIndex: number) => {
    const target = bullets[bulletIndex];
    if (!target) return;
    const children = (target.children || []).filter((_, i) => i !== childIndex);
    updateBullet(bulletIndex, { children });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <label className="font-bold text-sm block">{label}</label>
          {helperText && <p className="text-xs text-admin-text-secondary mt-1">{helperText}</p>}
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={addBullet} className="text-admin-accent">
          <Plus size={16} className="mr-1" /> Add Bullet
        </Button>
      </div>

      <div className="space-y-4">
        {bullets.length === 0 && (
          <div className="text-sm text-admin-text-secondary italic px-3 py-4 rounded-xl bg-admin-bg/30 border border-dashed border-admin-border text-center">
            No bullets yet. Click "Add Bullet" to start.
          </div>
        )}

        {bullets.map((bullet, bIndex) => (
          <div key={bIndex} className="p-4 rounded-2xl bg-admin-bg/40 border border-admin-border space-y-3">
            <div className="flex gap-2 items-start">
              <span className="text-admin-accent font-black pt-3 select-none">•</span>
              <Input
                value={bullet.text}
                onChange={(e) => updateBullet(bIndex, { text: e.target.value })}
                placeholder={`Bullet ${bIndex + 1}`}
                className="flex-1 bg-white border-none h-11 rounded-xl"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeBullet(bIndex)}
                className="text-red-500 hover:bg-red-50 shrink-0"
                aria-label="Remove bullet"
              >
                <Trash2 size={18} />
              </Button>
            </div>

            <div className="pl-7 space-y-2">
              {(bullet.children || []).map((child, cIndex) => (
                <div key={cIndex} className="flex gap-2 items-center">
                  <CornerDownRight size={14} className="text-admin-text-secondary shrink-0" />
                  <Input
                    value={child}
                    onChange={(e) => updateChild(bIndex, cIndex, e.target.value)}
                    placeholder={`Sub-bullet ${cIndex + 1}`}
                    className="flex-1 bg-white border-none h-10 rounded-lg text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeChild(bIndex, cIndex)}
                    className="text-red-400 hover:bg-red-50 shrink-0 h-8 w-8"
                    aria-label="Remove sub-bullet"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => addChild(bIndex)}
                className="text-admin-accent text-xs h-8"
              >
                <Plus size={14} className="mr-1" /> Add Sub-bullet
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
