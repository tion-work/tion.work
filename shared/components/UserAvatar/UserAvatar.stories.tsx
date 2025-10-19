import type { Meta, StoryObj } from "@storybook/react";
import { UserAvatar } from "./UserAvatar";

const meta: Meta<typeof UserAvatar> = {
  title: "Components/UserAvatar",
  component: UserAvatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    shape: {
      control: { type: "select" },
      options: ["circle", "square"],
    },
    onlineStatus: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithImage: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    alt: "User Profile",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "JS",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
    children: "AB",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "CD",
  },
};

export const Square: Story = {
  args: {
    shape: "square",
    children: "EF",
  },
};

export const Online: Story = {
  args: {
    onlineStatus: true,
    children: "GH",
  },
};

export const WithImageAndOnline: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    alt: "User Profile",
    onlineStatus: true,
  },
};
