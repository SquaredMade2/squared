// ImageNode.tsx
import { DecoratorNode, type SerializedLexicalNode } from 'lexical';
import ImageComponent from './imageComponent';

interface SerializedImageNode extends SerializedLexicalNode {
  src: string;
  altText: string;
  imageKey: string;
}

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __imageKey: string;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__imageKey, node.__key);
  }

  constructor(src: string, altText: string, imageKey: string, key?: string) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__imageKey = imageKey;
  }

  createDOM(): HTMLElement {
    const element = document.createElement('img');
    element.src = this.__src;
    element.alt = this.__altText;
    return element;
  }

  updateDOM(prevNode: ImageNode): boolean {
    return prevNode.__src !== this.__src || prevNode.__altText !== this.__altText;
  }

  decorate(): JSX.Element {
    return <ImageComponent src={this.__src} alt={this.__altText} />;
  }

  exportJSON(): SerializedImageNode {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      altText: this.__altText,
      imageKey: this.__imageKey,
    };
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, altText, imageKey } = serializedNode;
    return new ImageNode(src, altText, imageKey);
  }
}

export function $createImageNode(
  src: string,
  altText: string,
  imageKey: string,
  key?: string,
): ImageNode {
  return new ImageNode(src, altText, imageKey, key);
}
