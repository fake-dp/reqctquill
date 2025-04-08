'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import styled from 'styled-components';

const TipTapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link,
      Image,
      Placeholder.configure({
        placeholder: '내용을 입력해주세요',
      }),
    ],
    content: '',
  });

  useEffect(() => {
    if (!editor) return;

    const handleLog = () => {
      console.log(editor.getHTML()); // HTML 추출
    };

    window.addEventListener('beforeunload', handleLog);
    return () => {
      window.removeEventListener('beforeunload', handleLog);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <div className='p-4'>
      <Toolbar>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </button>
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
          Underline
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </button>
        <button
          onClick={() => {
            const url = prompt('링크 주소를 입력해주세요');
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          Link
        </button>
        <button
          onClick={() => {
            const url = prompt('이미지 주소를 입력해주세요');
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          Image
        </button>
      </Toolbar>

      <EditorWrapper>
        <StyledEditor editor={editor} />
      </EditorWrapper>
    </div>
  );
};

export default TipTapEditor;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  color: #000;
  button {
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    &:hover {
      background-color: #f3f3f3;
    }
  }
`;

const EditorWrapper = styled.div`
  background-color: #f6f6f6;
  border-radius: 12px;
  min-height: 280px;
  padding: 16px;
`;

const StyledEditor = styled(EditorContent)`
  .ProseMirror {
    font-size: 16px;
    color: #000;
    outline: none;
    min-height: 200px;

    img {
      max-width: 100%;
      margin: 12px 0;
      display: block;
    }

    a {
      color: #000;
      text-decoration: underline;
    }

    ul,
    ol {
      padding-left: 20px;
    }

    h1 {
      font-size: 24px;
      margin: 12px 0;
    }

    h2 {
      font-size: 20px;
      margin: 10px 0;
    }

    h3 {
      font-size: 18px;
      margin: 8px 0;
    }
  }
`;
