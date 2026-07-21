// mdx-components.tsx
// Required by @next/mdx for the App Router: its presence switches MDX output
// to static component resolution instead of the @mdx-js/react context
// provider, which cannot run in Server Components.
import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components };
}
