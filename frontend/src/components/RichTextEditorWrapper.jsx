import { RichTextEditor } from "mui-tiptap";

const schema = {
  topNode: "doc",
  nodes: {
    doc: {
      content: "block+",
    },
    paragraph: {
      content: "text*",
      group: "block",
      parseDOM: [{ tag: "p" }],
      toDOM: () => ["p", 0],
    },
  },
  marks: {
    bold: {
      parseDOM: [{ tag: "strong" }],
      toDOM: () => ["strong", 0],
    },
    // Define other marks if needed
  },
};

const RichTextEditorWrapper = () => {
  return (
    <RichTextEditor
      content={educProfile.achievements_story}
      onUpdate={({ getHTML }) => {
        setEducProfile({
          ...educProfile,
          achievements_story: getHTML(),
        });
      }}
      schema={schema}
    />
  );
};

export default RichTextEditorWrapper;
