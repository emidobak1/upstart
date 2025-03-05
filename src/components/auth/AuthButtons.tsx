'use client'

export function GoogleAuthButton(props: { text: string }) {
  return (
    <div 
      className="flex items-center justify-center 
        w-full p-2 rounded-md 
        text-sm
        bg-white text-gray-700 
        border border-gray-300 
        hover:bg-gray-50 
        transition-colors 
        space-x-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.69-2.26 1.1-3.71 1.1-2.87 0-5.3-1.94-6.17-4.54H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.83 14.11c-.25-.69-.38-1.43-.38-2.19s.14-1.5.38-2.19V6.89H2.18A9.999 9.999 0 0 0 2 12c0 1.62.39 3.16 1.08 4.54l3.75-2.93z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11.98 11.98 0 0 0 12 0C7.7 0 3.99 2.47 2.18 6.11l3.75 2.93c.87-2.6 3.3-4.54 6.17-4.54z"/>
      </svg>
      <span>{`${props.text} with Google`}</span>
    </div>
  )
}

export function LinkedInAuthButton(props: { text: string }) {
  return (
    <div 
      className="flex items-center justify-center 
        text-sm
        w-full p-2 rounded-md 
        bg-[#0A66C2] text-white 
        border border-transparent 
        hover:bg-[#0A66C2]/90 
        transition-colors 
        space-x-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
      </svg>
      <span>{`${props.text} with LinkedIn`}</span>
    </div>
  )
}

export function MicrosoftAuthButton(props: { text: string }) {
  return (
    <div 
      className="flex items-center justify-center 
        w-full p-2 rounded-md 
        text-sm
        bg-[#2F2F2F] text-white 
        border border-transparent 
        hover:bg-[#2F2F2F]/90 
        transition-colors 
        space-x-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="#F3F3F3" d="M0 0h11v11H0z"/>
        <path fill="#F35325" d="M12 0h11v11H12z"/>
        <path fill="#81BC06" d="M0 12h11v11H0z"/>
        <path fill="#05A6F0" d="M12 12h11v11H12z"/>
      </svg>
      <span>{`${props.text} with Microsoft`}</span>
    </div>
  )
}