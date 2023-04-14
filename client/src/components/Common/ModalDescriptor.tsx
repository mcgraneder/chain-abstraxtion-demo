interface IModalDescriptorProps {
  heading: string;
  subTitle: string;
  seperator: boolean;
}
const ModalDescriptor = ({
  heading,
  subTitle,
  seperator,
}: IModalDescriptorProps) => {
  return (
    <>
      <div className="m-4 flex flex-col items-start justify-start gap-2 px-2 py-2">
        <span className="text-[18px] font-[900]">{heading}</span>
        <span className="my-1 text-[15px] font-[600] text-[#7a6eaa]">
          {subTitle}
        </span>
      </div>
      {seperator ? (
        <div className="h-[1px] w-full bg-[rgb(231,227,235)]" />
      ) : null}
    </>
  );
};

export default ModalDescriptor;
