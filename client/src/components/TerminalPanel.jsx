function TerminalPanel() {
  const lines = [
    { text: "$ git clone workspace.git", delay: "0.2s" },
    { text: "$ cd workspace && npm install", delay: "0.8s" },
    { text: "$ npm run dev", delay: "1.4s" },
    { text: "✓ MongoDB connected", delay: "2.0s" },
    { text: "✓ Server ready on :5000", delay: "2.4s" },
    { text: "✓ Client ready on :5173", delay: "2.8s" },
  ];

  return (
    <div className="hidden md:flex w-1/2 bg-[var(--color-terminal)] flex-col justify-center px-12">
      <div className="w-full max-w-md">
        {/* Fake window chrome */}
        <div className="flex items-center gap-2 mb-4 px-4 py-3 bg-[#1E1D24] rounded-t-lg border border-[var(--color-border)] border-b-0">
          <span className="w-3 h-3 rounded-full bg-[#C77B6B]" />
          <span className="w-3 h-3 rounded-full bg-[#D4B483]" />
          <span className="w-3 h-3 rounded-full bg-[#8FA37E]" />
          <span className="ml-3 text-xs text-[var(--color-text-muted)]">workspace — zsh</span>
        </div>

        {/* Terminal body */}
        <div className="bg-[var(--color-terminal)] border border-[var(--color-border)] rounded-b-lg p-6 text-sm">
          {lines.map((line, i) => (
            <p
              key={i}
              className="terminal-line mb-2 text-[var(--color-text)]"
              style={{ animationDelay: line.delay }}
            >
              {line.text.startsWith("✓") ? (
                <span className="text-[var(--color-accent)]">{line.text}</span>
              ) : (
                <span>
                  <span className="text-[var(--color-accent)]">$</span>
                  {line.text.slice(1)}
                </span>
              )}
            </p>
          ))}
          <span className="inline-block w-2 h-4 bg-[var(--color-accent)] cursor-blink" />
        </div>

        <p className="mt-6 text-[var(--color-text-muted)] text-sm leading-relaxed">
          // Collaborative Developer Workspace
          <br />
          // Build, ship, and pair in real time.
        </p>
      </div>
    </div>
  );
}

export default TerminalPanel;