import React, { useRef } from "react";
import { Header, Segment } from "semantic-ui-react";
import { Editor } from "@tinymce/tinymce-react";
import "./style.css";

function PostEditor({ data }) {
  const editorRef = useRef(null);
  return (
    <div className="post-editor-page">
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue="<p>This is the initial content of the editor.</p>"
        onEditorChange={(newValue, editor) => {
          console.log("a", newValue);
          console.log("b", editor.getContent({ format: "text" }));
        }}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          toolbar:
            "fullscreen undo redo | bold italic underline | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter  | pagebreak |  emoticons |   preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment",
          toolbar_sticky: false,
          toolbar_mode: "sliding",
          contextmenu: "link image imagetools table configurepermanentpen",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
    </div>
  );
}

export default PostEditor;
