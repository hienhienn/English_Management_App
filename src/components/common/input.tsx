import tw from 'tailwind-styled-components';

interface InputProps {
  $error: boolean;
}

export const Input = tw.input<InputProps>`outline-none px-4 py-2 rounded-md bg-gray-50 border-2 border-gray-200 transition-all duration-300`;

export const YellowInput = tw(Input)`border-2
  ${(p) => (p.$error ? 'border-red-400' : 'focus:border-yellow-400')}
`;

export const DarkBlueInput = tw(Input)`border-2
  ${(p) => (p.$error ? 'border-red-400' : 'focus:border-blue-800')}
`;
