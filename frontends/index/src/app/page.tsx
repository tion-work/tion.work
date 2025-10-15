export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">tion.work</h1>
          <p className="text-xl text-gray-600 mb-8">现代化开发者工具集合平台</p>
          <p className="text-lg text-gray-500 mb-12">
            为开发者提供一站式解决方案，包含代码处理、数据处理、安全工具等20+个实用工具
          </p>

          <div className="space-y-4">
            <a
              href="https://dev.tion.work"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              访问开发工具站
            </a>
            <div className="text-sm text-gray-500">
              零注册使用 • 实时处理 • 响应式设计
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
