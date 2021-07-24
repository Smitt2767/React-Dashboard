import React from "react";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";

import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline";
import Strikethrough from "@ckeditor/ckeditor5-basic-styles/src/strikethrough";
import Code from "@ckeditor/ckeditor5-basic-styles/src/code";
import Subscript from "@ckeditor/ckeditor5-basic-styles/src/subscript";
import Superscript from "@ckeditor/ckeditor5-basic-styles/src/superscript";
import Font from "@ckeditor/ckeditor5-font/src/font";
import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import AutoLink from "@ckeditor/ckeditor5-link/src/autolink";
import Link from "@ckeditor/ckeditor5-link/src/link";
import ListStyle from "@ckeditor/ckeditor5-list/src/liststyle";
import CodeBlock from "@ckeditor/ckeditor5-code-block/src/codeblock";
import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed";
import Indent from "@ckeditor/ckeditor5-indent/src/indent";
import IndentBlock from "@ckeditor/ckeditor5-indent/src/indentblock";
import Table from "@ckeditor/ckeditor5-table/src/table";
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar";
import TableProperties from "@ckeditor/ckeditor5-table/src/tableproperties";
import TableCellProperties from "@ckeditor/ckeditor5-table/src/tablecellproperties";
import HtmlEmbed from "@ckeditor/ckeditor5-html-embed/src/htmlembed";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";
import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload";
import CKFinder from "@ckeditor/ckeditor5-ckfinder/src/ckfinder";
import UploadAdapterPlugin from "@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter";
import LinkImage from "@ckeditor/ckeditor5-link/src/linkimage";
import TodoList from "@ckeditor/ckeditor5-list/src/todolist";

const Ckeditor = () => {
  return (
    <div className="w-full h-full py-4 px-4 lg:px-8 flex items-start flex-col">
      <h1 className="text-4xl text-gray-800 hover:text-gray-500 cursor-pointer mb-8">
        CKEditor
      </h1>
      <div className="w-full">
        <CKEditor
          editor={ClassicEditor}
          config={{
            plugins: [
              Essentials,
              Bold,
              BlockQuote,
              Italic,
              Superscript,
              Subscript,
              Paragraph,
              Underline,
              Strikethrough,
              Code,
              Font,
              Alignment,
              Heading,
              AutoLink,
              Link,
              ListStyle,
              TodoList,
              CodeBlock,
              Table,
              TableToolbar,
              TableProperties,
              TableCellProperties,
              Indent,
              IndentBlock,
              MediaEmbed,
              HtmlEmbed,
              Image,
              ImageStyle,
              ImageCaption,
              ImageToolbar,
              ImageResize,
              ImageUpload,
              LinkImage,
              CKFinder,
              UploadAdapterPlugin,
            ],
            toolbar: {
              items: [
                "heading",
                "|",
                "bold",
                "italic",
                "link",
                "bulletedList",
                "numberedList",
                "todoList",
                "strikethrough",
                "subscript",
                "superscript",
                "underline",
                "fontFamily",
                "fontSize",
                "fontColor",
                "fontBackgroundColor",
                "|",
                "alignment",
                "indent",
                "outdent",
                "|",
                "uploadImage",
                "blockQuote",
                "insertTable",
                "mediaEmbed",
                "htmlEmbed",
                "code",
                "codeBlock",
                "undo",
                "redo",
              ],
              shouldNotGroupWhenFull: true,
            },
            table: {
              contentToolbar: [
                "tableColumn",
                "tableRow",
                "mergeTableCells",
                "tableProperties",
                "tableCellProperties",
              ],
            },
            ckfinder: {
              uploadUrl: "http://127.0.0.1:3001/uploadImage",
            },
            codeBlock: {
              languages: [
                { language: "javscript", label: "Javascript", className: "" },
                { language: "html", label: "HTML", className: "" },
                { language: "css", label: "Css", className: "" },
                { language: "php", label: "Php", className: "" },
                { language: "python", label: "Python", className: "" },
              ],
            },
            image: {
              toolbar: [
                "imageStyle:alignLeft",
                "imageStyle:alignRight",
                "imageStyle:alignCenter",
                "|",
                "imageStyle:alignBlockLeft",
                "imageStyle:alignBlockRight",
                "|",
                "toggleImageCaption",
                "imageTextAlternative",
                "|",
                "linkImage",
              ],
            },
          }}
          data={""}
          onChange={(event, editor) => {
            console.log(editor.getData());
          }}
          onReady={(editor) => {
            console.log(Array.from(editor.ui.componentFactory.names()));
          }}
        />
      </div>
    </div>
  );
};

export default Ckeditor;
