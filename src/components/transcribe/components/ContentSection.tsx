interface ContentSectionProps {
  title: string;
  content: string | string[];
  type?: 'hooks' | 'regular';
}

export function ContentSection({ title, content, type = 'regular' }: ContentSectionProps) {
  if (type === 'hooks' && Array.isArray(content)) {
    return (
      <div>
        <h4 className="text-base md:text-lg font-semibold text-foreground/80 mb-3">{title}</h4>
        <div className="space-y-2">
          {content.map((hook, index) => (
            <div key={index} className="bg-muted p-3 rounded-md">
              <p className="text-sm md:text-base leading-relaxed">
                <span className="font-medium text-foreground/70">Hook {index + 1}:</span> {hook}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-base md:text-lg font-semibold text-foreground/80 mb-3">{title}</h4>
      <div className="bg-muted p-3 rounded-md">
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {typeof content === 'string' ? content : ''}
        </p>
      </div>
    </div>
  );
}