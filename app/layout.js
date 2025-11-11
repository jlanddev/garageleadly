import './globals.css'

export const metadata = {
  title: 'GarageLeadly - Exclusive Garage Door Leads',
  description: 'Get exclusive, high-quality garage door repair leads delivered directly to your phone',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
