'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';

// SSR 비활성화된 Quill
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function Home() {
  const [content, setContent] = useState('');

  const handleChange = (value) => {
    setContent(value);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>ReactQuill 테스트</h1>
      <ReactQuill
        theme='snow'
        value={content}
        onChange={handleChange}
        placeholder='내용을 입력하세요'
        style={{ height: '300px', marginBottom: '20px' }}
      />
      <div>
        <h3>현재 입력된 내용:</h3>
        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
          {content}
        </div>
      </div>
    </div>
  );
}
