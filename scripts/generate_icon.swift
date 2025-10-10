#!/usr/bin/env swift

import SwiftUI
import AppKit

// MARK: - Helper Functions
func getProjectConfig(projectType: String) -> ([Color], String, String) {
    switch projectType {
    case "index":
        // 主站 - 蓝色渐变
        return (
            [
                Color(red: 0.2, green: 0.4, blue: 0.8),  // 深蓝色
                Color(red: 0.3, green: 0.5, blue: 0.9),  // 蓝色
                Color(red: 0.4, green: 0.6, blue: 0.7)   // 青蓝色
            ],
            "house.fill",
            "TiON"
        )
    case "dev":
        // 开发工具站 - 绿色渐变
        return (
            [
                Color(red: 0.2, green: 0.6, blue: 0.4),  // 深绿色
                Color(red: 0.3, green: 0.7, blue: 0.5),  // 绿色
                Color(red: 0.4, green: 0.8, blue: 0.6)   // 浅绿色
            ],
            "hammer.fill",
            "TiON"
        )
    case "admin":
        // 管理后台 - 紫色渐变
        return (
            [
                Color(red: 0.5, green: 0.2, blue: 0.7),  // 深紫色
                Color(red: 0.6, green: 0.3, blue: 0.8),  // 紫色
                Color(red: 0.7, green: 0.4, blue: 0.9)   // 浅紫色
            ],
            "gear.fill",
            "TiON"
        )
    case "docs":
        // 文档站点 - 橙色渐变
        return (
            [
                Color(red: 0.8, green: 0.4, blue: 0.2),  // 深橙色
                Color(red: 0.9, green: 0.5, blue: 0.3),  // 橙色
                Color(red: 1.0, green: 0.6, blue: 0.4)   // 浅橙色
            ],
            "book.fill",
            "TiON"
        )
    case "mobile":
        // 移动端 - 粉色渐变
        return (
            [
                Color(red: 0.8, green: 0.3, blue: 0.6),  // 深粉色
                Color(red: 0.9, green: 0.4, blue: 0.7),  // 粉色
                Color(red: 1.0, green: 0.5, blue: 0.8)   // 浅粉色
            ],
            "phone.fill",
            "TiON"
        )
    default:
        // 默认 - 蓝色渐变
        return (
            [
                Color(red: 0.2, green: 0.4, blue: 0.8),
                Color(red: 0.3, green: 0.5, blue: 0.9),
                Color(red: 0.4, green: 0.6, blue: 0.7)
            ],
            "star.fill",
            "TiON"
        )
    }
}

// MARK: - TiON Icon Generator
struct TiONIconGenerator: View {
    let size: CGFloat
    let projectType: String
    
    init(size: CGFloat = 1024, projectType: String = "main") {
        self.size = size
        self.projectType = projectType
    }
    
    var body: some View {
        ZStack {
            // 根据项目类型选择不同的渐变背景
            let (gradientColors, iconName, text) = getProjectConfig(projectType: projectType)
            
            LinearGradient(
                colors: gradientColors,
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .frame(width: size, height: size)
            
            // 添加装饰性的渐变圆形
            VStack {
                HStack {
                    Spacer()
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [Color.white.opacity(0.1), Color.clear],
                                center: .center,
                                startRadius: 0,
                                endRadius: size * 0.3
                            )
                        )
                        .frame(width: size * 0.4, height: size * 0.4)
                        .offset(x: size * 0.1, y: -size * 0.1)
                }
                Spacer()
                HStack {
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [Color.white.opacity(0.08), Color.clear],
                                center: .center,
                                startRadius: 0,
                                endRadius: size * 0.25
                            )
                        )
                        .frame(width: size * 0.3, height: size * 0.3)
                        .offset(x: -size * 0.1, y: size * 0.1)
                    Spacer()
                }
            }
            
            // Icon content
            VStack(spacing: size * 0.05) {
                // System icon
                Image(systemName: iconName)
                    .font(.system(size: size * 0.4, weight: .medium))
                    .foregroundColor(.white)
                
                // Icon name
                Text(text)
                    .font(.system(size: size * 0.15, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
            }
        }
    }
}

// MARK: - Flaretion Cover Image Generator
struct FlaretionCoverImageGenerator: View {
    let width: CGFloat
    let height: CGFloat
    
    init(width: CGFloat = 1500, height: CGFloat = 500) {
        self.width = width
        self.height = height
    }
    
    var body: some View {
        ZStack {
            // 漂亮的渐变背景
            LinearGradient(
                colors: [
                    Color(red: 0.2, green: 0.4, blue: 0.8),  // 深蓝色
                    Color(red: 0.4, green: 0.2, blue: 0.9),  // 紫色
                    Color(red: 0.6, green: 0.3, blue: 0.7),  // 紫红色
                    Color(red: 0.3, green: 0.5, blue: 0.6)   // 青蓝色
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .frame(width: width, height: height)
            
            // 添加一些装饰性的渐变圆形
            VStack {
                HStack {
                    Spacer()
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [Color.white.opacity(0.1), Color.clear],
                                center: .center,
                                startRadius: 0,
                                endRadius: 100
                            )
                        )
                        .frame(width: 200, height: 200)
                        .offset(x: 50, y: -50)
                }
                Spacer()
                HStack {
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [Color.white.opacity(0.08), Color.clear],
                                center: .center,
                                startRadius: 0,
                                endRadius: 80
                            )
                        )
                        .frame(width: 160, height: 160)
                        .offset(x: -30, y: 30)
                    Spacer()
                }
            }
            
            // 主要内容 - 左右分布布局
            VStack {
                Spacer()
                
                HStack(spacing: 0) {
                    // 左侧内容 - 图标和名称
                    VStack(alignment: .leading, spacing: 20) {
                        // 图标
                        Image(systemName: "flame.fill")
                            .font(.system(size: 80, weight: .medium))
                            .foregroundColor(.white)
                        
                        // 标题
                        Text("Flaretion")
                            .font(.system(size: 48, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.leading, 60)
                    
                    // 右侧内容 - 介绍
                    VStack(alignment: .trailing, spacing: 20) {
                        // 副标题
                        Text("Innovation & Wellness")
                            .font(.system(size: 24, weight: .medium))
                            .foregroundColor(.white.opacity(0.9))
                        
                        // 描述
                        Text("Building the future of digital wellness experiences")
                            .font(.system(size: 18, weight: .regular))
                            .foregroundColor(.white.opacity(0.8))
                            .multilineTextAlignment(.trailing)
                    }
                    .frame(maxWidth: .infinity, alignment: .trailing)
                    .padding(.trailing, 60)
                }
                
                Spacer()
            }
        }
    }
}

// MARK: - TiON Generator
class TiONGenerator {
    static func generateIcon(size: CGFloat, projectType: String = "main") -> NSImage? {
        let view = TiONIconGenerator(size: size, projectType: projectType)
        let hostingView = NSHostingView(rootView: view)
        hostingView.frame = NSRect(x: 0, y: 0, width: size, height: size)
        
        // 确保在高分辨率显示器上正确渲染
        hostingView.layer?.contentsScale = 1.0
        
        guard let rep = hostingView.bitmapImageRepForCachingDisplay(in: hostingView.bounds) else {
            return nil
        }
        
        // 设置正确的像素尺寸
        rep.size = NSSize(width: size, height: size)
        
        hostingView.cacheDisplay(in: hostingView.bounds, to: rep)
        
        let image = NSImage(size: NSSize(width: size, height: size))
        image.addRepresentation(rep)
        
        return image
    }
    
    static func generateCoverImage(width: CGFloat = 1500, height: CGFloat = 500) -> NSImage? {
        let view = FlaretionCoverImageGenerator(width: width, height: height)
        let hostingView = NSHostingView(rootView: view)
        hostingView.frame = NSRect(x: 0, y: 0, width: width, height: height)
        
        // 确保在高分辨率显示器上正确渲染
        hostingView.layer?.contentsScale = 1.0
        
        guard let rep = hostingView.bitmapImageRepForCachingDisplay(in: hostingView.bounds) else {
            return nil
        }
        
        // 设置正确的像素尺寸
        rep.size = NSSize(width: width, height: height)
        
        hostingView.cacheDisplay(in: hostingView.bounds, to: rep)
        
        let image = NSImage(size: NSSize(width: width, height: height))
        image.addRepresentation(rep)
        
        return image
    }
    
    static func saveIcon(size: CGFloat, filename: String, projectType: String = "main") {
        guard let image = generateIcon(size: size, projectType: projectType) else {
            print("Failed to generate icon for size \(size)")
            return
        }
        
        guard let tiffData = image.tiffRepresentation,
              let bitmapRep = NSBitmapImageRep(data: tiffData) else {
            print("Failed to convert image to TIFF")
            return
        }
        
        // 使用PNG属性
        let pngProperties: [NSBitmapImageRep.PropertyKey: Any] = [
            .compressionFactor: 1.0
        ]
        
        guard let pngData = bitmapRep.representation(using: .png, properties: pngProperties) else {
            print("Failed to convert image to PNG")
            return
        }
        
        let url = URL(fileURLWithPath: filename)
        do {
            try pngData.write(to: url)
            print("Saved icon: \(filename) (\(size)x\(size)) - TiON \(projectType)")
        } catch {
            print("Failed to save icon: \(error)")
        }
    }
    
    static func saveFavicon(projectType: String, outputDir: String) {
        // 生成 32x32 的 favicon
        let filename = "\(outputDir)/favicon.ico"
        saveIcon(size: 32, filename: filename, projectType: projectType)
        
        // 生成其他尺寸的 PNG 图标
        let sizes: [CGFloat] = [16, 32, 48, 64, 128, 256, 512]
        for size in sizes {
            let filename = "\(outputDir)/favicon-\(Int(size))x\(Int(size)).png"
            saveIcon(size: size, filename: filename, projectType: projectType)
        }
        
        // 生成 apple-touch-icon
        let appleFilename = "\(outputDir)/apple-touch-icon.png"
        saveIcon(size: 180, filename: appleFilename, projectType: projectType)
    }
    
    static func saveCoverImage(width: CGFloat = 1500, height: CGFloat = 500, filename: String) {
        guard let image = generateCoverImage(width: width, height: height) else {
            print("Failed to generate cover image for size \(width)x\(height)")
            return
        }
        
        guard let tiffData = image.tiffRepresentation,
              let bitmapRep = NSBitmapImageRep(data: tiffData) else {
            print("Failed to convert image to TIFF")
            return
        }
        
        // 使用PNG属性
        let pngProperties: [NSBitmapImageRep.PropertyKey: Any] = [
            .compressionFactor: 1.0
        ]
        
        guard let pngData = bitmapRep.representation(using: .png, properties: pngProperties) else {
            print("Failed to convert image to PNG")
            return
        }
        
        let url = URL(fileURLWithPath: filename)
        do {
            try pngData.write(to: url)
            print("Saved cover image: \(filename) (\(width)x\(height)) - Flaretion")
        } catch {
            print("Failed to save cover image: \(error)")
        }
    }
    
    static func generateAllFavicons() {
        let projects = [
            ("index", "../frontends/index/public"),
            ("dev", "../frontends/dev/public"),
            ("admin", "../frontends/admin/public"),
            ("docs", "../frontends/docs/public"),
            ("mobile", "../frontends/mobile/public")
        ]
        
        print("Generating TiON favicons for all frontend projects...")
        
        for (projectType, outputDir) in projects {
            print("Generating favicons for \(projectType) project...")
            saveFavicon(projectType: projectType, outputDir: outputDir)
        }
        
        print("All TiON favicon generation complete!")
    }
    
    static func generateFavicon(projectType: String, outputDir: String) {
        print("Generating TiON favicon for \(projectType) project...")
        saveFavicon(projectType: projectType, outputDir: outputDir)
        print("TiON favicon generation complete!")
    }
}

// MARK: - Main
if CommandLine.arguments.count > 1 {
    let command = CommandLine.arguments[1]
    
    switch command {
    case "all":
        TiONGenerator.generateAllFavicons()
    case "index":
        TiONGenerator.generateFavicon(projectType: "index", outputDir: "frontends/index/public")
    case "dev":
        TiONGenerator.generateFavicon(projectType: "dev", outputDir: "frontends/dev/public")
    case "admin":
        TiONGenerator.generateFavicon(projectType: "admin", outputDir: "frontends/admin/public")
    case "docs":
        TiONGenerator.generateFavicon(projectType: "docs", outputDir: "frontends/docs/public")
    case "mobile":
        TiONGenerator.generateFavicon(projectType: "mobile", outputDir: "frontends/mobile/public")
    case "help":
        print("TiON Favicon Generator")
        print("Usage:")
        print("  swift generate_icon.swift all     - Generate favicons for all frontend projects")
        print("  swift generate_icon.swift index   - Generate favicon for main site")
        print("  swift generate_icon.swift dev     - Generate favicon for dev tools site")
        print("  swift generate_icon.swift admin   - Generate favicon for admin panel")
        print("  swift generate_icon.swift docs    - Generate favicon for docs site")
        print("  swift generate_icon.swift mobile  - Generate favicon for mobile site")
        print("  swift generate_icon.swift help    - Show this help")
        print("")
        print("This script generates TiON favicons with:")
        print("- Different gradient colors for each project type")
        print("- Project-specific icons (house, hammer, gear, book, phone)")
        print("- Decorative gradient circles")
        print("- Modern, professional design")
    default:
        print("Unknown command: \(command)")
        print("Use 'swift generate_icon.swift help' for usage information")
    }
} else {
    // Default behavior: generate all favicons
    TiONGenerator.generateAllFavicons()
}
