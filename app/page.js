'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const isIOS =
  typeof window !== 'undefined' &&
  /iPhone|iPad|iPod/i.test(navigator.userAgent);

const WritePage = () => {
  const [content, setContent] = useState('');
  const quillRef = useRef(null);
  const isComposingRef = useRef(false);

  const handleContentChange = (value) => {
    setContent(value);
  };

  const modules = useMemo(() => {
    return {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
      ],
    };
  }, []);

  useEffect(() => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const handleCompositionStart = () => {
      isComposingRef.current = true;
    };

    const handleCompositionEnd = () => {
      isComposingRef.current = false;
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && isComposingRef.current) {
        e.preventDefault();
        editor.insertText(editor.getSelection().index, '\n');
      }
    };

    editor.root.addEventListener('compositionstart', handleCompositionStart);
    editor.root.addEventListener('compositionend', handleCompositionEnd);
    editor.root.addEventListener('keydown', handleKeyDown);

    return () => {
      editor.root.removeEventListener(
        'compositionstart',
        handleCompositionStart
      );
      editor.root.removeEventListener('compositionend', handleCompositionEnd);
      editor.root.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className='p-4'>
      <CustomEditor
        ref={quillRef}
        value={content}
        onChange={handleContentChange}
        modules={modules}
        theme='snow'
        placeholder='내용을 입력해주세요'
        style={{
          height: '280px',
          marginBottom: '84px',
          marginTop: '12px',
        }}
      />
    </div>
  );
};

export default WritePage;

const CustomEditor = styled(ReactQuill)`
  .ql-container {
    border: none;
    background-color: #f6f6f6;
    border-radius: 12px;
  }
  .ql-toolbar {
    border: none;
    background-color: #fff;
  }
  .ql-editor {
    font-size: 16px;
    color: #374151;
    min-height: 200px;
  }
  .ql-tooltip {
    z-index: 10000;
    position: absolute !important;
    left: 0 !important;
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  }
  .ql-editor iframe {
    width: 100%;
    max-width: 700px;
    aspect-ratio: 16 / 9;
    display: block;
    margin: 16px auto;
  }
`;
