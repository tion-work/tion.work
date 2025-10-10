import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://dev.tion.work";

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
        },
      },
    },
    // 工具页面
    {
      url: `${baseUrl}/tools/json-formatter`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          "zh-CN": `${baseUrl}/tools/json-formatter`,
          "en-US": `${baseUrl}/tools/json-formatter`,
        },
      },
    },
    {
      url: `${baseUrl}/tools/base64-encoder`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          "zh-CN": `${baseUrl}/tools/base64-encoder`,
          "en-US": `${baseUrl}/tools/base64-encoder`,
        },
      },
    },
    {
      url: `${baseUrl}/tools/password-generator`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          "zh-CN": `${baseUrl}/tools/password-generator`,
          "en-US": `${baseUrl}/tools/password-generator`,
        },
      },
    },
    {
      url: `${baseUrl}/tools/timestamp-converter`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          "zh-CN": `${baseUrl}/tools/timestamp-converter`,
          "en-US": `${baseUrl}/tools/timestamp-converter`,
        },
      },
    },
    {
      url: `${baseUrl}/tools/qr-code-generator`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          "zh-CN": `${baseUrl}/tools/qr-code-generator`,
          "en-US": `${baseUrl}/tools/qr-code-generator`,
        },
      },
    },
  ];
}
