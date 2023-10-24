import Popup from 'reactjs-popup';
import { WhiteBlueButton, DarkBlueButton } from '../base/Button';

type Props = {
  open: boolean;
  onClickNo: any;
  onClickYes: any;
  title: string;
  clickNo?: string;
  clickYes?: string;
};

const ConfirmDialog = ({
  open,
  onClickNo,
  onClickYes,
  title,
  clickNo = 'Huỷ',
  clickYes = 'Xoá',
}: Props) => {
  return (
    <Popup open={open} closeOnDocumentClick onClose={onClickNo}>
      <div className="p-8 w-[500px]">
        <p>{title}</p>
        <br />
        <div className="flex justify-end gap-2">
          <WhiteBlueButton onClick={onClickNo}>{clickNo}</WhiteBlueButton>
          <DarkBlueButton onClick={onClickYes}>{clickYes}</DarkBlueButton>
        </div>
      </div>
    </Popup>
  );
};

export default ConfirmDialog;
