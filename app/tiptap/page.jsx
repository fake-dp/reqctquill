'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Heading from '@tiptap/extension-heading';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { useState } from 'react';
import styled from 'styled-components';

const TipTapEditor = () => {
  const [title, setTitle] = useState('');
  const [charCount, setCharCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Image,
      Heading.configure({ levels: [1, 2, 3] }),
      Placeholder.configure({ placeholder: '내용을 입력해주세요' }),
      TextStyle,
      Color,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setCharCount(editor.getText().length);
    },
  });

  const handleSubmit = () => {
    if (!editor) return;
    const content = editor.getHTML();
    console.log('제목:', title);
    console.log('내용:', content);
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        editor?.chain().focus().setImage({ src: base64 }).run();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <Wrapper>
      <TitleInput
        placeholder='제목을 입력해주세요'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Toolbar>
        <button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </button>
        <button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>
        <button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </button>
        <button onClick={() => editor?.chain().focus().toggleBold().run()}>
          B
        </button>
        <button onClick={() => editor?.chain().focus().toggleUnderline().run()}>
          U
        </button>
        <button
          className={editor?.isActive('strike') ? 'is-active' : ''}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          S
        </button>
        <input
          type='color'
          onChange={(e) =>
            editor?.chain().focus().setColor(e.target.value).run()
          }
          value={editor?.getAttributes('textStyle').color || '#000000'}
          style={{
            width: 32,
            height: 32,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
        />
        <button onClick={handleImageUpload}>🖼</button>
      </Toolbar>

      <EditorBox>
        <StyledEditor editor={editor} />
        <CharCount>{charCount}/6000</CharCount>
      </EditorBox>

      <SubmitButton onClick={handleSubmit}>등록</SubmitButton>
    </Wrapper>
  );
};

export default TipTapEditor;

const Wrapper = styled.div`
  padding: 20px;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 16px;
  font-size: 16px;
  border: none;
  background-color: #f5f5f5;
  border-radius: 12px;
  margin-bottom: 16px;
  outline: none;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;

  button {
    background: none;
    border: 1px solid #ccc;
    font-size: 14px;
    cursor: pointer;
    color: #333;
    padding: 6px 10px;
    border-radius: 4px;
    &:hover {
      background-color: #eee;
    }
    &.is-active {
      background-color: #ddd;
    }
  }
`;

const EditorBox = styled.div`
  position: relative;
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 16px;
  min-height: 200px;
`;

const StyledEditor = styled(EditorContent)`
  .ProseMirror {
    outline: none;
    font-size: 16px;
    color: #111;
    min-height: 200px;

    h1 {
      font-size: 1.5rem;
    }
    h2 {
      font-size: 1.25rem;
    }
    h3 {
      font-size: 1.125rem;
    }
    ul,
    ol {
      padding-left: 20px;
    }
    img {
      max-width: 100%;
      display: block;
      margin: 10px 0;
    }
    a {
      color: #007aff;
      text-decoration: underline;
    }
  }
`;

const CharCount = styled.div`
  position: absolute;
  bottom: 12px;
  right: 16px;
  font-size: 13px;
  color: #999;
`;

const SubmitButton = styled.button`
  width: 100%;
  margin-top: 20px;
  background-color: #1e40ff;
  color: #fff;
  padding: 14px 0;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: #1740e0;
  }
`;
