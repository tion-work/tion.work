import React from 'react';

/**
 * HelloWorld 组件 - 一个简单的 React 组件示例
 * 用于演示 AI 开发助手的代码生成和分析功能
 */
const HelloWorld = ({ name = 'World', message = 'Hello' }) => {
  const [count, setCount] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(true);

  const handleClick = () => {
    setCount(prev => prev + 1);
  };

  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };

  if (!isVisible) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <button onClick={toggleVisibility}>
          显示组件
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      textAlign: 'center',
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      <h2>{message}, {name}!</h2>
      <p>点击次数: {count}</p>
      <div style={{ marginTop: '10px' }}>
        <button
          onClick={handleClick}
          style={{
            marginRight: '10px',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          点击我
        </button>
        <button
          onClick={toggleVisibility}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          隐藏组件
        </button>
      </div>
    </div>
  );
};

export default HelloWorld;
