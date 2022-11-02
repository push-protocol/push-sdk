type handleOnChatIconClickProps = {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

export const handleOnChatIconClick = ({ isModalOpen, setIsModalOpen }: handleOnChatIconClickProps) => {
  console.log(isModalOpen);
  setIsModalOpen(!isModalOpen);
};