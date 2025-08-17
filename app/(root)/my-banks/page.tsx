export default function MyBanksPage() {
  const linked = [
    { name: "HDFC Bank", accounts: 2 },
    { name: "ICICI Bank", accounts: 1 },
  ];
  return (
    <section className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">My Banks</h1>
      <p className="text-gray-600">Manage and view linked banks.</p>
      <div className="bg-white rounded-lg border border-gray-100 divide-y">
        {linked.map((b) => (
          <div key={b.name} className="p-4 flex items-center justify-between">
            <span className="font-medium">{b.name}</span>
            <span className="text-sm text-gray-600">{b.accounts} accounts</span>
          </div>
        ))}
      </div>
    </section>
  );
}
