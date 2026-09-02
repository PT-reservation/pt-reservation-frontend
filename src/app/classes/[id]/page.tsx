import { ClassDetailView } from './ClassDetailView';

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ClassDetailView classId={Number(id)} />;
}
