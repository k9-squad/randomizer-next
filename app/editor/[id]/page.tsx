import {
  Empty,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { FileEdit } from "lucide-react";

export default function EditorPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Empty>
        <EmptyIcon>
          <FileEdit className="h-16 w-16" />
        </EmptyIcon>
        <EmptyTitle>编辑器页面</EmptyTitle>
        <EmptyDescription>
          此页面正在开发中，敬请期待...
        </EmptyDescription>
      </Empty>
    </div>
  );
}
