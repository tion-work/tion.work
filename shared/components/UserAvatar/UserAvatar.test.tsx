import { render, screen } from "@testing-library/react";
import React from "react";
import { UserAvatar } from "./UserAvatar";

describe("UserAvatar", () => {
  it("renders without crashing", () => {
    render(<UserAvatar />);
    expect(screen.getByRole("generic")).toBeInTheDocument();
  });

  it("renders with image when src is provided", () => {
    render(<UserAvatar src="test.jpg" alt="Test User" />);
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "test.jpg");
    expect(img).toHaveAttribute("alt", "Test User");
  });

  it("renders placeholder when no src is provided", () => {
    render(<UserAvatar />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("renders children when provided", () => {
    render(<UserAvatar>JS</UserAvatar>);
    expect(screen.getByText("JS")).toBeInTheDocument();
  });

  it("applies correct size classes", () => {
    const { rerender } = render(<UserAvatar size="sm" />);
    expect(screen.getByRole("generic")).toHaveClass("w-8", "h-8");

    rerender(<UserAvatar size="md" />);
    expect(screen.getByRole("generic")).toHaveClass("w-12", "h-12");

    rerender(<UserAvatar size="lg" />);
    expect(screen.getByRole("generic")).toHaveClass("w-16", "h-16");
  });

  it("applies correct shape classes", () => {
    const { rerender } = render(<UserAvatar shape="circle" />);
    expect(screen.getByRole("generic")).toHaveClass("rounded-full");

    rerender(<UserAvatar shape="square" />);
    expect(screen.getByRole("generic")).toHaveClass("rounded-lg");
  });

  it("shows online status when enabled", () => {
    render(<UserAvatar onlineStatus={true} />);
    expect(screen.getByRole("generic")).toHaveClass("relative");
    // 检查在线状态指示器
    const statusIndicator = screen
      .getByRole("generic")
      .querySelector(".bg-green-500");
    expect(statusIndicator).toBeInTheDocument();
  });
});
