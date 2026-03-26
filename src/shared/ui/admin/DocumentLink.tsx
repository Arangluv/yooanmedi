import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

const DocumentLink = () => {
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      prefetch={false}
      href="https://www.notion.so/32f69eeaa30b802c997dd0d08da01f24"
      className="bg-muted text-primary mb-8 flex items-center gap-1 rounded-md p-4 text-lg"
    >
      배너 설정방법
      <ExternalLink className="size-5" />
    </Link>
  );
};

export default DocumentLink;
