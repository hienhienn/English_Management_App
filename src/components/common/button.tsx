import tw from 'tailwind-styled-components';

interface ButtonProps {
  $disable: boolean;
}

export const Button = tw.button<ButtonProps>`rounded-md py-2 px-4 transition-all duration-300 outline-none
  ${(p) => (p.$disable ? 'bg-slate-500' : '')}
`;

export const YellowButton = tw(Button)` text-white
  ${(p) => (p.$disable ? 'bg-slate-300' : 'bg-yellow-400 hover:bg-yellow-500')}
`;

export const BlueButton = tw(Button)`bg-blue-500 hover:bg-blue-600 text-white
  ${(p) => (p.$disable ? 'bg-slate-300' : 'bg-blue-500 hover:bg-blue-600')}
`;
