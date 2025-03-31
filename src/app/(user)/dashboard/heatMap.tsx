"use client";

import React from "react";
import Tooltip from "@uiw/react-tooltip";
import HeatMap from "@uiw/react-heat-map";
import { convertDateToString } from "@/lib/utils";

type Props = {
  data: {
    createdAt: Date;
    count: number;
  }[];
};

const panelColors = [
  "#1c1917", // темный фон для пустых ячеек
  "#FFCCAA", // самый светлый оранжевый
  "#FFA07A", // светло-оранжевый
  "#FF8C52", // средний оранжевый
  "#FF6B00", // основной оранжевый (primary)
];

const SubmissionsHeatMap = (props: Props) => {
  const formattedDates = props.data.map((item) => ({
    date: convertDateToString(item.createdAt),
    count: item.count,
  }));

  return (
    <div className="w-full">
      <HeatMap
        value={formattedDates}
        width="100%"
        style={{ color: "#6c7381" }}
        panelColors={panelColors}
        startDate={new Date("2025/01/01")}
        rectProps={{
          rx: 2,
        }}
        rectRender={(props, data) => {
          if (!data.count) return <rect {...props} />;
          return (
            <Tooltip
              placement="top"
              content={`${data.date}: ${data.count} submissions`}
            >
              <rect {...props} />
            </Tooltip>
          );
        }}
      />
    </div>
  );
};

export default SubmissionsHeatMap;
