'use client';

import { usePathname } from 'next/navigation';

export function CanonicalLinks({ locale }: { locale: string }) {
  const fullPathname = usePathname();
  
  const baseUrl = 'https://hub-game.com';
  
  // fullPathname includes the locale e.g. "/ja/heroes", strip it to get cleanPathname
  const prefix = `/${locale}`;
  let cleanPathname = fullPathname.startsWith(prefix) 
    ? fullPathname.slice(prefix.length) 
    : fullPathname;
    
  if (cleanPathname === '/') cleanPathname = '';
  
  const currentUrl = `${baseUrl}/${locale}${cleanPathname}`;
  const jaUrl = `${baseUrl}/ja${cleanPathname}`;
  const enUrl = `${baseUrl}/en${cleanPathname}`;
  // For x-default, we can point to the Japanese version since it's our default
  const xDefaultUrl = jaUrl;

  return (
    <>
      <link rel="canonical" href={currentUrl} />
      <link rel="alternate" hrefLang="ja" href={jaUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={xDefaultUrl} />
    </>
  );
}
