'use client';

import dynamic from 'next/dynamic';
import '@toast-ui/editor/dist/toastui-editor.css';
import { useRef, useState } from 'react';

// dynamic import로 SSR 방지
const ToastEditor = dynamic(
  () => import('@toast-ui/react-editor').then((mod) => mod.Editor),
  {
    ssr: false,
  }
);

export default function EditorPage() {
  const editorRef = useRef(null);
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (editorRef.current) {
      const markdown = editorRef.current.getInstance().getMarkdown();
      setContent(markdown);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '12px',
          color: 'green',
        }}
      >
        📄 마크다운 글쓰기
      </h1>
      <ToastEditor
        ref={editorRef}
        initialValue='Hello, Toast UI Editor 👋'
        previewStyle='vertical'
        height='400px'
        initialEditType='wysiwyg' // ✅ wysiwyg로 변경
        useCommandShortcut={true}
        hideModeSwitch={true} // ✅ 모드 전환 탭 숨김
      />
      <button
        onClick={handleSave}
        style={{
          marginTop: '16px',
          backgroundColor: '#1e90ff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        저장하기
      </button>

      {content && (
        <div style={{ marginTop: '40px' }}>
          <h2>📝 저장된 마크다운 내용:</h2>
          <pre
            style={{
              backgroundColor: '#f4f4f4',
              padding: '16px',
              borderRadius: '8px',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              fontSize: '14px',
            }}
          >
            {content}
          </pre>
        </div>
      )}
    </div>
  );
}
