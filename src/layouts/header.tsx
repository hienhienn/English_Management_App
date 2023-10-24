import Image from 'next/image';
import DropDown from '@/components/base/DropDown';
import { useRouter } from 'next/navigation';
import {
  DotsVerticalIcon,
  MenuIcon,
  MinusIcon,
} from '@heroicons/react/outline';

export default function Header({ hideMenu = false, openNav, setOpenNav }: any) {
  const valueDropDown = (
    <Image
      src="/avatar.jpg"
      width={40}
      height={40}
      alt="user-avatar"
      className="hover:scale-90 rounded-full"
    />
  );
  const itemsMenu = [
    {
      key: 'info',
      value: 'Thông tin cá nhân',
      onChange: () => router.push('/home/info'),
    },
    {
      key: 'login',
      value: 'Đăng xuất',
      onChange: (e: any) => {
        localStorage.removeItem('accessToken');
        router.push('/login');
      },
    },
  ];
  const router = useRouter();

  return (
    <div className="w-full border-b border-gray-400 bg-blue-800  sticky top-0 left-0 z-50">
      <div className="flex justify-between px-5 py-3 mx-auto">
        <div className="mr-2 h-10 leading-10 font-semibold text-[18px] text-white flex">
          {!openNav && (
            <MenuIcon
              className="h-6 my-2 mr-3 cursor-pointer"
              onClick={() => {
                setOpenNav(true);
                localStorage.setItem('openNav', 'true');
              }}
            />
          )}
          {openNav && (
            <DotsVerticalIcon
              className="h-6 my-2 mr-3 cursor-pointer"
              onClick={() => {
                setOpenNav(false);
                localStorage.setItem('openNav', 'false');
              }}
            />
          )}
          English Learning App
        </div>
        <div>
          <DropDown value={valueDropDown} items={itemsMenu} />
        </div>
      </div>
    </div>
  );
}
