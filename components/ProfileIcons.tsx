// Line icons for the company profile, drawn on a 24-unit grid in
// `currentColor` so each theme decides the colour: white in the red badges of
// the light themes, red inside the outlined slashes of the dark one.

const paths = {
  quality: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="m12 6 1 2.1 2.2.3-1.6 1.5.4 2.2-2-1.1-2 1.1.4-2.2-1.6-1.5 2.2-.3Z" />
      <path d="M8.5 14 7 22l5-3 5 3-1.5-8" />
    </>
  ),
  warranty: (
    <>
      <path d="M12 3 5 5.5v5c0 4.2 3 7.4 7 8.5 4-1.1 7-4.3 7-8.5v-5Z" />
      <path d="m9 11 2 2 4-4" />
    </>
  ),
  durability: (
    <>
      <path d="m11 17 2 2a1 1 0 0 0 1.4-1.4" />
      <path d="m14 14 2.5 2.5a1 1 0 0 0 1.4-1.4l-3.9-3.9a2 2 0 0 0-2.8 0l-.9.9a1.4 1.4 0 0 1-2-2l2.8-2.8a3.5 3.5 0 0 1 4.3-.5l.5.3a2 2 0 0 0 1.4.3L21 7" />
      <path d="m21 3 1 11h-2" />
      <path d="M3 3 2 14l6.5 6.5a1 1 0 0 0 1.4-1.4" />
      <path d="M3 4h8" />
    </>
  ),
  availability: (
    <>
      <path d="M21 8.5 12 4 3 8.5v7L12 20l9-4.5Z" />
      <path d="M3 8.5 12 13l9-4.5M12 13v7" />
    </>
  ),
  reliable: (
    <>
      <path d="M12 3a9 9 0 1 0 9 9" />
      <path d="M12 12 18 6" />
      <path d="M16 3h5v5" />
      <circle cx="12" cy="12" r="1.5" />
    </>
  ),
  eco: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z" />
      <path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12" />
    </>
  ),
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  ),
  mail: (
    <>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
    </>
  )
};

export type ProfileIconName = keyof typeof paths;

export default function ProfileIcon({name}: {name: ProfileIconName}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
