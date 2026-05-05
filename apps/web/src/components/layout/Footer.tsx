export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0 bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by RideConnect Inc. The leading P2P vehicle marketplace.
        </p>
        <div className="flex items-center space-x-4 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-foreground">
            Terms
          </a>
          <a href="#" className="hover:text-foreground">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
