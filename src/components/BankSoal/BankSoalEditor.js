import {
  BlockQuote,
  Bold,
  ClassicEditor as ClassicEditorBase,
  Essentials,
  Heading,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Italic,
  Link,
  List,
  Paragraph,
  Underline,
  Undo,
} from "ckeditor5";

class BankSoalEditor extends ClassicEditorBase {}

BankSoalEditor.builtinPlugins = [
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  BlockQuote,
  Heading,
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageResize,
  ImageUpload,
  ImageTextAlternative,
  Undo,
];

BankSoalEditor.defaultConfig = {
  toolbar: {
    items: [
      "undo",
      "redo",
      "|",
      "heading",
      "|",
      "bold",
      "italic",
      "underline",
      "link",
      "uploadImage",
      "|",
      "bulletedList",
      "numberedList",
      "blockQuote",
    ],
  },
  image: {
    resizeUnit: "%",
    resizeOptions: [
      {
        name: "resizeImage:original",
        value: null,
        label: "Original",
      },
      {
        name: "resizeImage:25",
        value: "25",
        label: "25%",
      },
      {
        name: "resizeImage:50",
        value: "50",
        label: "50%",
      },
      {
        name: "resizeImage:75",
        value: "75",
        label: "75%",
      },
    ],
    toolbar: [
      "imageStyle:inline",
      "imageStyle:wrapText",
      "imageStyle:breakText",
      "|",
      "resizeImage",
      "|",
      "toggleImageCaption",
      "imageTextAlternative",
    ],
  },
  language: "id",
};

export default BankSoalEditor;
