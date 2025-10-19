import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

/**
 * React Hooks 示例组件
 * 演示各种 React Hooks 的用法，用于 AI 代码分析和学习
 */

interface User {
  id: number;
  name: string;
  email: string;
}

interface HooksExampleProps {
  initialCount?: number;
  onCountChange?: (count: number) => void;
}

const HooksExample: React.FC<HooksExampleProps> = ({ 
  initialCount = 0, 
  onCountChange 
}) => {
  // useState - 状态管理
  const [count, setCount] = useState(initialCount);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useRef - 引用 DOM 元素或存储可变值
  const inputRef = useRef<HTMLInputElement>(null);
  const previousCountRef = useRef<number>();

  // useEffect - 副作用处理
  useEffect(() => {
    // 组件挂载时获取用户数据
    fetchUsers();
  }, []); // 空依赖数组，只在挂载时执行

  useEffect(() => {
    // 监听 count 变化
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  useEffect(() => {
    // 保存前一次的 count 值
    previousCountRef.current = count;
  });

  // useCallback - 缓存函数，避免不必要的重新渲染
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers: User[] = [
        { id: 1, name: '张三', email: 'zhangsan@example.com' },
        { id: 2, name: '李四', email: 'lisi@example.com' },
        { id: 3, name: '王五', email: 'wangwu@example.com' },
      ];
      
      setUsers(mockUsers);
    } catch (err) {
      setError('获取用户数据失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // useMemo - 缓存计算结果
  const userCount = useMemo(() => {
    console.log('计算用户数量...');
    return users.length;
  }, [users]);

  const expensiveValue = useMemo(() => {
    console.log('执行复杂计算...');
    // 模拟复杂计算
    let result = 0;
    for (let i = 0; i < count * 1000000; i++) {
      result += Math.random();
    }
    return result;
  }, [count]);

  // 事件处理函数
  const handleIncrement = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const handleDecrement = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);

  const handleReset = useCallback(() => {
    setCount(initialCount);
  }, [initialCount]);

  const handleFocusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleAddUser = useCallback((name: string, email: string) => {
    const newUser: User = {
      id: Date.now(),
      name,
      email,
    };
    setUsers(prev => [...prev, newUser]);
  }, []);

  // 渲染用户列表
  const renderUsers = useMemo(() => {
    if (loading) return <div>加载中...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (users.length === 0) return <div>暂无用户数据</div>;

    return (
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    );
  }, [users, loading, error]);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>React Hooks 示例</h2>
      
      {/* 计数器部分 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>计数器 (useState)</h3>
        <p>当前计数: {count}</p>
        <p>前一次计数: {previousCountRef.current}</p>
        <div>
          <button onClick={handleIncrement}>+1</button>
          <button onClick={handleDecrement} style={{ margin: '0 10px' }}>-1</button>
          <button onClick={handleReset}>重置</button>
        </div>
      </div>

      {/* 输入框部分 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>输入框 (useRef)</h3>
        <input 
          ref={inputRef}
          type="text" 
          placeholder="点击按钮聚焦到这里"
          style={{ marginRight: '10px' }}
        />
        <button onClick={handleFocusInput}>聚焦输入框</button>
      </div>

      {/* 用户列表部分 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>用户列表 (useEffect, useCallback)</h3>
        <button onClick={fetchUsers} disabled={loading}>
          {loading ? '加载中...' : '刷新用户数据'}
        </button>
        <div style={{ marginTop: '10px' }}>
          {renderUsers}
        </div>
        <p>用户总数: {userCount}</p>
      </div>

      {/* 复杂计算部分 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>复杂计算 (useMemo)</h3>
        <p>计算结果: {expensiveValue.toFixed(2)}</p>
        <p>注意: 只有当 count 改变时才会重新计算</p>
      </div>

      {/* 添加用户部分 */}
      <div>
        <h3>添加用户</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const name = formData.get('name') as string;
          const email = formData.get('email') as string;
          if (name && email) {
            handleAddUser(name, email);
            e.currentTarget.reset();
          }
        }}>
          <div style={{ marginBottom: '10px' }}>
            <input 
              name="name" 
              type="text" 
              placeholder="姓名" 
              required 
              style={{ marginRight: '10px' }}
            />
            <input 
              name="email" 
              type="email" 
              placeholder="邮箱" 
              required 
              style={{ marginRight: '10px' }}
            />
            <button type="submit">添加用户</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HooksExample;
