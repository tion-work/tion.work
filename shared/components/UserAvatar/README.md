# UserAvatar

一个用户头像组件，支持图片显示、尺寸调整、形状选择和在线状态指示。

## 用法

```tsx
import { UserAvatar } from './UserAvatar';

// 基础用法
<UserAvatar />

// 带图片
<UserAvatar
  src="https://example.com/avatar.jpg"
  alt="User Profile"
/>

// 自定义尺寸和形状
<UserAvatar
  size="lg"
  shape="square"
  children="AB"
/>

// 显示在线状态
<UserAvatar
  onlineStatus={true}
  children="JS"
/>
```

## Props

| 属性         | 类型                 | 默认值        | 描述                   |
| ------------ | -------------------- | ------------- | ---------------------- |
| src          | string               | -             | 头像图片源             |
| alt          | string               | 'User Avatar' | 图片替代文本           |
| size         | 'sm' \| 'md' \| 'lg' | 'md'          | 头像尺寸               |
| shape        | 'circle' \| 'square' | 'circle'      | 头像形状               |
| onlineStatus | boolean              | false         | 是否显示在线状态       |
| className    | string               | -             | 自定义类名             |
| children     | ReactNode            | -             | 当没有图片时显示的内容 |

## 尺寸

- `sm`: 32x32px (w-8 h-8)
- `md`: 48x48px (w-12 h-12)
- `lg`: 64x64px (w-16 h-16)

## 形状

- `circle`: 圆形头像
- `square`: 方形头像

## 在线状态

当 `onlineStatus` 为 `true` 时，会在头像右下角显示一个绿色的在线状态指示器。

## 样式

组件使用 Tailwind CSS 进行样式设计，支持自定义类名覆盖默认样式。

## 可访问性

- 支持 `alt` 属性为图片提供替代文本
- 使用语义化的 HTML 结构
- 支持键盘导航
