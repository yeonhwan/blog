export default function PageTitle({ title }: { title: string }) {
  return (
    <h1 className="font-mono text-neon-blue-100 dark:text-neon-green-100 font-bold text-mb-h1 mt-16 mb-6 capitalize laptop:text-dt-h1">{`<${title}/>`}</h1>
  );
}
