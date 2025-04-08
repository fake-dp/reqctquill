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
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const quillRef = useRef(null);
  const iosEnterHandlerAppliedRef = useRef(false);

  const handleContentChange = (value) => {
    setContent(value);
  };

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

  const handleTitleChange = (e) => setTitle(e.target.value);

  const imageHandler = () => {
    try {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.setAttribute('multiple', 'true');
      input.click();

      input.onchange = () => {
        if (!input.files) return;

        const files = Array.from(input.files);
        if (files.length > 5) {
          setModalDescription('이미지는 최대 5개까지 등록할 수 있습니다.');
          setModalOnConfirm(() => () => setModalOpen(false));
          setModalOpen(true);
          return;
        }

        files.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (quillRef.current) {
              const editor = quillRef.current.getEditor();
              const range = editor.getSelection(true);
              editor.insertEmbed(range.index, 'image', e.target.result);
            }
          };
          reader.readAsDataURL(file);
        });
      };
    } catch (error) {
      console.error(error);
    }
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          ['link', 'image', 'video'],
          [{ align: [] }],
        ],
        handlers: {
          image: imageHandler,
        },
      },

      keyboard: {},
    };
  }, []);

  useEffect(() => {
    if (!isIOS || !quillRef.current) return;

    const editor = quillRef.current.getEditor();
    if (!editor || iosEnterHandlerAppliedRef.current) return;

    iosEnterHandlerAppliedRef.current = true;

    const enterHandler = function (range, context) {
      const currentIndex = range ? range.index : editor.getSelection()?.index;

      if (currentIndex !== undefined) {
        const formats = editor.getFormat(currentIndex);
        editor.insertText(currentIndex, '\n', formats);
        setTimeout(() => {
          editor.setSelection(currentIndex + 1, 0);
          editor.root.focus();
        }, 50);
      }

      return false;
    };

    editor.keyboard.addBinding({ key: 13 }, enterHandler);
    editor.keyboard.addBinding({ key: 13, shiftKey: true }, enterHandler);

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        const selection = editor.getSelection();
        if (selection) {
          e.preventDefault();
          enterHandler(selection);
        }
      }
    };

    editor.root.addEventListener('keydown', handleKeyDown);

    return () => {
      if (editor && editor.root) {
        editor.root.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div className='p-4'>
      <CustomEditor
        ref={quillRef}
        value={content}
        onChange={handleContentChange}
        theme='snow'
        placeholder='내용을 입력해주세요'
        onKeyDown={isIOS ? undefined : handleKeyUp}
        onKeyUp={handleKeyUp}
        modules={modules}
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
    @media (max-width: 440px) {
      padding-bottom: 120px;
      overflow-y: auto;
      height: 100%;
      -webkit-user-select: text;
    }
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
