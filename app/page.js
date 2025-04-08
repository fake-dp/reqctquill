'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { useState, useRef, useMemo } from 'react';
import styled from 'styled-components';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const isIOS =
  typeof window !== 'undefined' &&
  /iPhone|iPad|iPod/i.test(navigator.userAgent);

export default function QuillTestPage() {
  const [content, setContent] = useState('');
  const quillRef = useRef(null);

  const modules = useMemo(
    () => ({ toolbar: [['bold', 'italic', 'underline']] }),
    []
  );

  const handleKeyUp = () => {
    const editor = quillRef.current?.getEditor?.();
    if (editor) {
      const editorElem = editor.root;
      if (editorElem.innerHTML === '<p><br></p>') {
        editorElem.classList.add('ql-blank');
      } else {
        editorElem.classList.remove('ql-blank');
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <CustomEditor
        ref={quillRef}
        value={content}
        onChange={setContent}
        onKeyUp={handleKeyUp} // 🔥 여기 적용
        placeholder='내용을 입력해주세요'
        modules={modules}
        theme='snow'
        style={{
          height: '300px',
          marginBottom: '40px',
        }}
      />
      <div>실시간 값:</div>
      <pre>{content}</pre>
    </div>
  );
}

const CustomEditor = styled(ReactQuill)`
  .ql-container {
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
  }
  .ql-editor {
    font-size: 16px;
    min-height: 200px;
    padding: 10px;
    color: #333;
  }
`;
