import tw from 'tailwind-styled-components';

const Button = tw.button`py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg`;

export default Button;

export const DarkBlueButton = tw.button`
  rounded-lg
  bg-blue-900   
  hover:bg-blue-800
  text-white
  w-36
  py-2   
  px-4
`;

export const WhiteBlueButton = tw.button`
  rounded-lg
  bg-white
  border
  border-blue-900
  hover:bg-gray-200
  text-blue-900
  w-36
  py-2
  px-4
`;

export const WhiteRedButton = tw.button`
  rounded-lg
  bg-white
  border
  border-red-600
  hover:bg-gray-200
  text-red-600
  w-36
  py-2
  px-4
  outline-none
`;

export const BlueButton = tw.button`
  rounded-lg
  bg-gradient-to-b from-cyan-300 to-cyan-600
  text-white
  w-36
  py-2
  px-4
`;

export const CancelButton = tw.button`
  bg-gradient-to-b from-cyan-300 to-cyan-600
  text-white
  p-3
  mt-3
`;

export const StopSaleButton = tw.button`rounded-lg
  px-4 py-2
  my-2
  text-white
  font-bold
bg-gradient-to-b from-red-500 to-red-700`;

export const GreenButton = tw.button`rounded-lg
  py-1
  px-2
  w-36
  text-white 
  font-bold
  bg-gradient-to-b from-green-500 to-green-700`;

export const YellowButton = tw.button`rounded-lg
  py-1
  px-2 
  text-white
  font-bold
  bg-gradient-to-b from-yellow-400 to-yellow-700`;
