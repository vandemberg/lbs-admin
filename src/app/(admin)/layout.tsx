export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <p>Hello, world!</p>
      {children}
      <footer>Footer content here</footer>
      <p>Additional content can go here.</p>
    </div>
  );
}
