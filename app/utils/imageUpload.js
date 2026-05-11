// Simulates uploading an image file and returning a URL
export async function uploadImage(file) {
  await new Promise(resolve => setTimeout(resolve, 300))
  // In production, send to your API and return the real URL
  return `https://picsum.photos/seed/${file.name}-${Date.now()}/800/400`
}

// Walks TipTap JSON content, finds base64 images and uploads them
export async function processContentImages(content) {
  async function processNode(node) {
    if (node.type === 'image' && node.attrs?.src?.startsWith('data:')) {
      const res = await fetch(node.attrs.src)
      const blob = await res.blob()
      const file = new File([blob], 'image.png', { type: blob.type })
      const url = await uploadImage(file)
      return { ...node, attrs: { ...node.attrs, src: url } }
    }

    if (node.content?.length) {
      const newContent = await Promise.all(node.content.map(processNode))
      return { ...node, content: newContent }
    }

    return node
  }

  return processNode(content)
}