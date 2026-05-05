import StudioShell from "./studio-shell";

export const dynamic = "force-static";
export const dynamicParams = false;

export const generateStaticParams = async () => [{ tool: [] }];

export default function StudioPage() {
  return (
    <div className="studio-shell">
      <StudioShell />
    </div>
  );
}
