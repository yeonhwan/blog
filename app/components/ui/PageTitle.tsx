export default function PageTitle({ title }: { title: string }) {
  return (
    <div className="font-fira text-neon-green-100 font-bold text-mb-h1 mt-16 mb-6 capitalize laptop:text-dt-h1">{`<${title}/>`}</div>
  );
}
