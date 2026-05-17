export const metadata = {
  title: 'Alcana Group Platform',
  description: 'Onboarding Assessment Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  )
}