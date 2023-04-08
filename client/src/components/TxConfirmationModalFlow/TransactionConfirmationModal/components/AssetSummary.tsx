import { Icon } from "../../../Icons/AssetLogs/Icon";

interface IAssetSummary {
  fullName: string;
  shortName: string;
  icon: string;
}

const AssetSummary = ({ icon, fullName, shortName }: IAssetSummary) => {
  return (
    <div className="my-1 mb-1 flex items-center justify-between rounded-xl border border-[rgb(231,227,235)] bg-[#eeeaf4] p-4">
      <span className="text-[20px] font-semibold">{fullName}</span>
      <div className="flex items-center justify-center gap-3">
        <Icon chainName={icon} className="h-7 w-7" />
        <div className="flex flex-col items-start justify-start text-center">
          <span className="text-[16px]">{shortName}</span>
        </div>
      </div>
    </div>
  );
};

export default AssetSummary

