// 重新导出共享工具函数
export * from '../../../../shared/utils/core';

// 添加项目特定的工具函数
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
