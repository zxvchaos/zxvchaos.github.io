import { useState, useEffect } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract h2 headings from the prose content
    const prose = document.querySelector(".prose-dark");
    if (!prose) return;

    const headings = prose.querySelectorAll("h2");
    const tocItems: TocItem[] = [];

    headings.forEach((h) => {
      // Ensure heading has an id
      if (!h.id) {
        h.id = h.textContent
          ?.toLowerCase()
          .replace(/[^\w\u3000-\u9fff\u4e00-\u9fff\u30a0-\u30ff\u3040-\u309f]+/g, "-")
          .replace(/^-|-$/g, "") || "";
      }
      tocItems.push({
        id: h.id,
        text: h.textContent?.replace(/^[\d]+\.\s*/, "").replace(/^[一二三四五六七八九十]+、\s*/, "") || "",
        level: 2,
      });
    });

    setItems(tocItems);

    // Intersection Observer for active section tracking
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible heading
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <nav className="hidden lg:block fixed top-24 w-52 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-text-dim">
        Contents
      </p>
      <ul className="space-y-1.5 border-l border-border/50">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`block pl-3 py-0.5 text-xs leading-snug transition-all duration-200 border-l -ml-px ${
                activeId === item.id
                  ? "border-accent text-accent font-medium"
                  : "border-transparent text-text-dim hover:text-text-muted hover:border-text-dim"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
