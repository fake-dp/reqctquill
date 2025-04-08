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
  const isComposingRef = useRef(false); // 한글 조합 중 상태

  const handleContentChange = (value) => {
    setContent(value);
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
        ],
      },
      keyboard: {}, // 커스텀 바인딩은 useEffect에서 처리
    };
  }, []);

  useEffect(() => {
    if (!isIOS || !quillRef.current) return;

    const editor = quillRef.current.getEditor();
    if (!editor) return;

    const enterHandler = (range) => {
      const currentIndex = range?.index ?? editor.getSelection()?.index;
      if (typeof currentIndex === 'number') {
        const formats = editor.getFormat(currentIndex);
        editor.insertText(currentIndex, '\n', formats);
        setTimeout(() => {
          editor.setSelection(currentIndex + 1, 0);
        }, 30);
      }
      return false;
    };

    // 한글 조합 감지
    const handleCompositionStart = () => {
      isComposingRef.current = true;
    };
    const handleCompositionEnd = () => {
      isComposingRef.current = false;
    };

    // 엔터 바인딩 추가
    editor.keyboard.addBinding({ key: 13 }, (range) => {
      if (isComposingRef.current) return true;
      return enterHandler(range);
    });

    editor.root.addEventListener('compositionstart', handleCompositionStart);
    editor.root.addEventListener('compositionend', handleCompositionEnd);

    return () => {
      editor.root.removeEventListener(
        'compositionstart',
        handleCompositionStart
      );
      editor.root.removeEventListener('compositionend', handleCompositionEnd);
    };
  }, []);

  return (
    <div className='p-4'>
      <h2>iOS 한글 줄바꿈 테스트</h2>
      <CustomEditor
        ref={quillRef}
        value={content}
        onChange={handleContentChange}
        theme='snow'
        placeholder='한글로 입력하고 엔터를 쳐보세요'
        modules={modules}
        style={{
          height: '300px',
          marginBottom: '60px',
        }}
      />
    </div>
  );
};

export default WritePage;

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
