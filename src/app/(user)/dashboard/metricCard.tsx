import { roundIfNumber } from "@/lib/utils";

type Props = {
  value: number | string | null;
  label: string;
};

const MetricCard = (props: Props) => {
  const { value, label } = props;

  return (
    <div className="text-center">
      <p className="text-[#6c7381] font-medium text-xs sm:text-sm leading-tight">
        {label}
      </p>
      <p className="text-lg sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 text-white">
        {roundIfNumber(value)}
      </p>
    </div>
  );
};

export default MetricCard;
