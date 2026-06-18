export default function AppFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="flex flex-col items-center justify-between gap-2 px-4 py-5 text-sm text-muted-foreground md:flex-row md:px-6">
        <p>© 2026 MotoRent Admin. All rights reserved.</p>

        <div className="flex items-center gap-5">
          <button className="transition-colors hover:text-foreground">
            Terms of Service
          </button>

          <button className="transition-colors hover:text-foreground">
            Support
          </button>

          <button className="transition-colors hover:text-foreground">
            Contact
          </button>
        </div>
      </div>
    </footer>
  );
}
