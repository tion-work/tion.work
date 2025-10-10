import React from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { ToolCardProps } from '@/types';
import { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  code: require('lucide-react').Code,
  data: require('lucide-react').Database,
  security: require('lucide-react').Shield,
  utility: require('lucide-react').Wrench,
  design: require('lucide-react').Palette,
  text: require('lucide-react').Type,
};

const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onClick,
  className,
}) => {
  const IconComponent = iconMap[tool.category] || iconMap.utility;

  return (
    <Card
      className={cn(
        'tool-card cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600  
            <IconComponent className="h-6 w-6" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-secondary-900  truncate">
            {tool.name}
          </h3>
          <p className="mt-1 text-sm text-secondary-600  line-clamp-2">
            {tool.description}
          </p>
          <div className="mt-2 flex items-center space-x-2">
            <span className="inline-flex items-center rounded-full bg-secondary-100 px-2 py-1 text-xs font-medium text-secondary-800  
              {tool.category}
            </span>
            {!tool.isActive && (
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800  
                Coming Soon
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ToolCard;
