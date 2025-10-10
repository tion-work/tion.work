"use client";

import { UsageStats } from "@/components/ui/UsageStats";
import { useLanguage } from "@/contexts/LanguageContext";

export default function StatsPage() {
  const { content } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {content.pages.stats.title}
          </h1>
          <p className="text-lg text-gray-600">
            {content.pages.stats.description}
          </p>
        </div>

        <UsageStats />
      </div>
    </div>
  );
}
