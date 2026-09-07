import { parseFragment, type DefaultTreeAdapterTypes } from "parse5";

type ChildNode = DefaultTreeAdapterTypes.ChildNode;
type ParentNode = DefaultTreeAdapterTypes.ParentNode;

export type NormalizedDomNode =
  | {
      type: "element";
      name: string;
      attributes: [string, string][];
      children: NormalizedDomNode[];
    }
  | { type: "text"; value: string }
  | { type: "comment"; value: string };

/**
 * Normalize parsed HTML for serializer-parity assertions.
 * Whitespace-only text nodes and attribute order are serializer details; all
 * meaningful structure, attributes, text, and comments remain significant.
 */
export function normalizeDom(html: string): NormalizedDomNode[] {
  return normalizeChildren(parseFragment(html));
}

function normalizeChildren(parent: ParentNode): NormalizedDomNode[] {
  return parent.childNodes.flatMap((node) => normalizeNode(node));
}

function normalizeNode(node: ChildNode): NormalizedDomNode[] {
  if (node.nodeName === "#text" && "value" in node) {
    const value = node.value;
    return /^\s*$/.test(value) ? [] : [{ type: "text", value }];
  }

  if (node.nodeName === "#comment" && "data" in node) {
    return [{ type: "comment", value: node.data }];
  }

  if ("tagName" in node && "attrs" in node && "childNodes" in node) {
    return [
      {
        type: "element",
        name: node.tagName,
        attributes: node.attrs
          .map(
            (attribute) => [attribute.name, attribute.value] as [string, string]
          )
          .sort(([left], [right]) => left.localeCompare(right)),
        children: normalizeChildren(node),
      },
    ];
  }

  return "childNodes" in node
    ? normalizeChildren(node as unknown as ParentNode)
    : [];
}
