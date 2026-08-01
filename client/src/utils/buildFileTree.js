// Converts a flat array of {_id, parent, ...} into a nested tree structure
export function buildFileTree(nodes) {
  const nodeMap = {};
  const roots = [];

  // First pass: create a lookup map, and give every node an empty children array
  nodes.forEach((node) => {
    nodeMap[node._id] = { ...node, children: [] };
  });

  // Second pass: attach each node to its parent's children array
  nodes.forEach((node) => {
    if (node.parent && nodeMap[node.parent]) {
      nodeMap[node.parent].children.push(nodeMap[node._id]);
    } else {
      roots.push(nodeMap[node._id]);
    }
  });

  // Sort: folders first, then alphabetically within each group
  const sortNodes = (list) => {
    list.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    list.forEach((n) => sortNodes(n.children));
  };
  sortNodes(roots);

  return roots;
}