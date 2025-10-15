import { generateToolMetadata } from "@/lib/metadata";
import { ToolRegistry } from "@/lib/tools";
import { registerTools } from "@/lib/tools/registry";
import { notFound } from "next/navigation";

interface ToolLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  // 注册所有工具
  registerTools();

  const tool = ToolRegistry.get(params.id);
  if (!tool) {
    return {
      title: "工具未找到 | dev.tion.work",
      description: "请求的工具不存在",
    };
  }

  // 获取工具的本地化内容
  const localizedContent = tool.getLocalizedContent("zh");

  return generateToolMetadata(
    localizedContent.name,
    localizedContent.description,
    "zh",
    params.id
  );
}

export default function ToolLayout({ children, params }: ToolLayoutProps) {
  // 注册所有工具
  registerTools();

  const tool = ToolRegistry.get(params.id);
  if (!tool) {
    notFound();
  }

  return <>{children}</>;
}
