export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function CropLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
