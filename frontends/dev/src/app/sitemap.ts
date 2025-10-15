import { registerTools, ToolRegistry } from "@/lib/tools/registry";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://dev.tion.work";

  // 注册所有工具
  registerTools();
  const allTools = ToolRegistry.getAll();

  // 生成工具页面
  const toolPages = allTools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
    alternates: {
      languages: {
        "zh-CN": `${baseUrl}/tools/${tool.id}`,
        "en-US": `${baseUrl}/tools/${tool.id}`,
        "ja-JP": `${baseUrl}/tools/${tool.id}`,
      },
    },
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: {
          "zh-CN": baseUrl,
          "en-US": baseUrl,
          "ja-JP": baseUrl,
        },
      },
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          "zh-CN": `${baseUrl}/about`,
          "en-US": `${baseUrl}/about`,
          "ja-JP": `${baseUrl}/about`,
        },
      },
    },
    {
      url: `${baseUrl}/stats`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: {
          "zh-CN": `${baseUrl}/stats`,
          "en-US": `${baseUrl}/stats`,
          "ja-JP": `${baseUrl}/stats`,
        },
      },
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
      alternates: {
        languages: {
          "zh-CN": `${baseUrl}/privacy`,
          "en-US": `${baseUrl}/privacy`,
          "ja-JP": `${baseUrl}/privacy`,
        },
      },
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
      alternates: {
        languages: {
          "zh-CN": `${baseUrl}/terms`,
          "en-US": `${baseUrl}/terms`,
          "ja-JP": `${baseUrl}/terms`,
        },
      },
    },
    // 动态生成所有工具页面
    ...toolPages,
  ];
}
