'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Heading from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Youtube from '@tiptap/extension-youtube';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const COLORS = [
  '#FF0000',
  '#FF7F00',
  '#FFFF00',
  '#00FF00',
  '#0000FF',
  '#4B0082',
  '#9400D3',
  '#000000',
  '#444444',
  '#888888',
  '#CCCCCC',
  '#FFFFFF',
  '#00CED1',
  '#FF1493',
  '#FFA07A',
  '#2E8B57',
];

const TipTapEditor = () => {
  const [title, setTitle] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [activeUrlType, setActiveUrlType] = useState(null);
  const urlInputRef = useRef(null);

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
    setActiveUrlType(null);
  };

  const toggleUrlInput = (type) => {
    setActiveUrlType((prev) => (prev === type ? null : type));
    setOpenDropdown(null);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
    setActiveUrlType(null);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        autolink: false,
        openOnClick: false,
        linkOnPaste: false,
      }),
      Image,
      Youtube,
      Heading.configure({ levels: [1, 2, 3] }),
      Placeholder.configure({ placeholder: '내용을 입력해주세요' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
    ],
    content: '',
    editorProps: {
      handleDOMEvents: {
        mousedown: () => {
          if (openDropdown || activeUrlType) closeDropdown();
        },
      },
    },
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
    input.multiple = true;

    input.onchange = () => {
      const files = Array.from(input.files || []);
      if (!files.length) return;

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result;
          if (base64 && editor) {
            editor
              .chain()
              .focus()
              .insertContent({
                type: 'image',
                attrs: { src: base64 },
              })
              .run();
          }
        };
        reader.readAsDataURL(file);
      });
    };

    input.click();
  };

  const applyUrl = () => {
    if (!urlInput) return;
    const formattedUrl = urlInput.startsWith('http')
      ? urlInput
      : `https://${urlInput}`;

    if (activeUrlType === 'link') {
      editor
        ?.chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: formattedUrl })
        .run();
    } else if (activeUrlType === 'youtube') {
      editor?.chain().focus().setYoutubeVideo({ src: formattedUrl }).run();
    }
    setUrlInput('');
    setActiveUrlType(null);
  };

  useEffect(() => {
    if (activeUrlType && urlInputRef.current) {
      urlInputRef.current.focus();
    }
  }, [activeUrlType]);

  return (
    <Wrapper>
      <TitleInput
        placeholder='제목을 입력해주세요'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Toolbar>
        <Dropdown>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown('heading');
            }}
          >
            T
          </button>
          {openDropdown === 'heading' && (
            <DropdownMenu>
              <div
                onClick={() => {
                  editor?.chain().focus().setParagraph().run();
                  closeDropdown();
                }}
              >
                Normal
              </div>
              <div
                onClick={() => {
                  editor?.chain().focus().toggleHeading({ level: 1 }).run();
                  closeDropdown();
                }}
              >
                H1
              </div>
              <div
                onClick={() => {
                  editor?.chain().focus().toggleHeading({ level: 2 }).run();
                  closeDropdown();
                }}
              >
                H2
              </div>
              <div
                onClick={() => {
                  editor?.chain().focus().toggleHeading({ level: 3 }).run();
                  closeDropdown();
                }}
              >
                H3
              </div>
            </DropdownMenu>
          )}
        </Dropdown>

        <button onClick={() => editor?.chain().focus().toggleBold().run()}>
          B
        </button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()}>
          I
        </button>
        <button onClick={() => editor?.chain().focus().toggleUnderline().run()}>
          U
        </button>
        <button onClick={() => editor?.chain().focus().toggleStrike().run()}>
          S
        </button>

        <Dropdown>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown('textColor');
            }}
          >
            🎨
          </button>
          {openDropdown === 'textColor' && (
            <ColorPalette>
              {COLORS.map((color) => (
                <ColorChip
                  key={color}
                  color={color}
                  onClick={() => {
                    editor?.chain().focus().setColor(color).run();
                    closeDropdown();
                  }}
                />
              ))}
            </ColorPalette>
          )}
        </Dropdown>

        <Dropdown>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown('align');
            }}
          >
            ≡
          </button>
          {openDropdown === 'align' && (
            <DropdownMenu>
              <div
                onClick={() => {
                  editor?.chain().focus().setTextAlign('left').run();
                  closeDropdown();
                }}
              >
                Left
              </div>
              <div
                onClick={() => {
                  editor?.chain().focus().setTextAlign('center').run();
                  closeDropdown();
                }}
              >
                Center
              </div>
              <div
                onClick={() => {
                  editor?.chain().focus().setTextAlign('right').run();
                  closeDropdown();
                }}
              >
                Right
              </div>
            </DropdownMenu>
          )}
        </Dropdown>

        <button onClick={() => toggleUrlInput('link')}>🔗</button>
        <button onClick={() => toggleUrlInput('youtube')}>▶️</button>
        <button onClick={handleImageUpload}>🖼</button>
      </Toolbar>

      {activeUrlType && (
        <UrlInputContainer>
          <input
            ref={urlInputRef}
            type='text'
            placeholder='URL을 입력하세요'
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            style={{ color: '#333' }}
          />
          <button onClick={applyUrl}>적용</button>
        </UrlInputContainer>
      )}

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

    iframe {
      width: 100%;
      height: auto;
      max-width: 100%;
      display: block;
      margin: 12px 0;
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

const Dropdown = styled.div`
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 36px;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  z-index: 10;

  div {
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
    color: #333;
    &:hover {
      background: #eee;
    }
  }
`;

const ColorPalette = styled.div`
  position: absolute;
  top: 36px;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: grid;
  grid-template-columns: repeat(4, 24px);
  gap: 8px;
  padding: 10px;
  z-index: 10;
`;

const ColorChip = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: ${(props) => props.color};
  cursor: pointer;
  border: 1px solid #aaa;
`;

const UrlInputContainer = styled.div`
  display: flex;
  gap: 8px;
  margin: 12px 0;
  input {
    flex: 1;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
    outline: none;
    color: #333;
  }
  button {
    padding: 8px 12px;
    font-size: 14px;
    border: none;
    border-radius: 6px;
    background-color: #1e40ff;
    color: white;
    cursor: pointer;
  }
`;
