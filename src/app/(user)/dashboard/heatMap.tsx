"use client";

import React, { useState } from "react";
import { convertDateToString } from "@/lib/utils";

type Props = {
  data: {
    createdAt: Date;
    count: number;
  }[];
};

const SubmissionsHeatMap = (props: Props) => {
  const [tooltip, setTooltip] = useState<{
    content: string;
    x: number;
    y: number;
    visible: boolean;
  }>({ content: "", x: 0, y: 0, visible: false });

  // Создаем массив дат за весь год
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const startDate = new Date(currentYear, 0, 1); // 1 января текущего года
    const endDate = new Date(currentYear, 11, 31); // 31 декабря текущего года

    // Находим первое воскресенье года (или начало года, если 1 января - воскресенье)
    const firstSunday = new Date(startDate);
    const dayOfWeek = firstSunday.getDay();
    if (dayOfWeek !== 0) {
      // Если 1 января не воскресенье, идем назад к предыдущему воскресенью
      firstSunday.setDate(firstSunday.getDate() - dayOfWeek);
    }

    // Генерируем даты от первого воскресенья до конца года
    for (
      let d = new Date(firstSunday);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      dates.push(new Date(d));
    }
    return dates;
  };

  const allDates = generateDates();

  // Создаем карту данных для быстрого поиска
  const dataMap = new Map();
  props.data.forEach((item) => {
    const dateStr = convertDateToString(item.createdAt);
    dataMap.set(dateStr, item.count);
  });

  // Функция для определения цвета ячейки
  const getCellColor = (count: number) => {
    if (count === 0 || count === undefined) return "#1c1917"; // темный фон
    if (count <= 1) return "#FFCCAA"; // самый светлый оранжевый
    if (count <= 2) return "#FFA07A"; // светло-оранжевый
    if (count <= 3) return "#FF8C52"; // средний оранжевый
    return "#FF6B00"; // основной оранжевый
  };

  // Функция для получения дня недели
  const getDayOfWeek = (date: Date) => {
    return date.getDay();
  };

  // Группируем даты по неделям (каждая неделя начинается с воскресенья)
  const weeks: Date[][] = [];
  for (let i = 0; i < allDates.length; i += 7) {
    const week = allDates.slice(i, i + 7);
    // Дополняем неделю до 7 дней, если нужно
    while (week.length < 7) {
      const lastDate = new Date(week[week.length - 1]);
      lastDate.setDate(lastDate.getDate() + 1);
      week.push(lastDate);
    }
    weeks.push(week);
  }

  // Функция для получения названия месяца
  const getMonthName = (date: Date) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[date.getMonth()];
  };

  // Функция для определения, нужно ли показывать месяц
  const shouldShowMonth = (weekIndex: number, week: Date[]) => {
    if (weekIndex === 0) return true;

    // Проверяем, есть ли в этой неделе первое число месяца
    const hasFirstOfMonth = week.some((date) => date.getDate() === 1);

    // Также показываем месяц, если это первая неделя с датами текущего года
    const currentYear = new Date().getFullYear();
    const hasCurrentYearDates = week.some(
      (date) =>
        date.getFullYear() === currentYear &&
        date.getMonth() === 0 &&
        date.getDate() <= 7
    );

    return hasFirstOfMonth || hasCurrentYearDates;
  };

  const handleMouseEnter = (
    event: React.MouseEvent,
    date: Date,
    count: number
  ) => {
    const dateStr = convertDateToString(date);
    const content =
      count > 0
        ? `${dateStr}: ${count} submissions`
        : `${dateStr}: No submissions`;

    // Получаем позицию элемента относительно viewport
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = event.currentTarget
      .closest(".heatmap-container")
      ?.getBoundingClientRect();

    if (containerRect) {
      setTooltip({
        content,
        x: rect.left - containerRect.left + rect.width / 2, // позиция относительно контейнера
        y: rect.top - containerRect.top - 35, // выше ячейки
        visible: true,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div className="w-full relative heatmap-container">
      <div className="flex items-start gap-2 w-full">
        {/* Дни недели */}
        <div className="flex flex-col gap-1 pt-8 flex-shrink-0">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="h-4 w-10 text-xs text-gray-500 text-center flex items-center justify-center"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Хитмапа с месяцами */}
        <div className="flex gap-1 flex-1 min-w-0">
          {weeks.map((week, weekIndex) => (
            <div
              key={weekIndex}
              className="flex flex-col gap-1 flex-1 relative"
            >
              {/* Название месяца */}
              {shouldShowMonth(weekIndex, week) && (
                <div className="h-6 text-xs text-gray-500 flex items-center justify-center mb-1">
                  {getMonthName(week[0])}
                </div>
              )}

              {/* Пустое место для выравнивания, если месяц не показывается */}
              {!shouldShowMonth(weekIndex, week) && (
                <div className="h-6 mb-1"></div>
              )}

              {/* Ячейки недели */}
              {week.map((date, dayIndex) => {
                const dateStr = convertDateToString(date);
                const count = dataMap.get(dateStr) || 0;
                const color = getCellColor(count);

                return (
                  <div
                    key={dayIndex}
                    className="w-full h-4 rounded-sm cursor-pointer transition-all duration-200 hover:scale-110 hover:ring-2 hover:ring-orange-400/50"
                    style={{ backgroundColor: color }}
                    onMouseEnter={(e) => handleMouseEnter(e, date, count)}
                    onMouseLeave={handleMouseLeave}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Кастомный тултип */}
      {tooltip.visible && (
        <div
          className="absolute z-50 px-3 py-2 text-sm text-white bg-zinc-900/95 backdrop-blur-sm rounded-lg shadow-lg pointer-events-none border border-zinc-800"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translateX(-50%)",
          }}
        >
          {tooltip.content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-900/95"></div>
        </div>
      )}

      {/* Легенда */}
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
        <span>Less</span>
        <div className="flex gap-1">
          <div
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: "#1c1917" }}
          ></div>
          <div
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: "#FFCCAA" }}
          ></div>
          <div
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: "#FFA07A" }}
          ></div>
          <div
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: "#FF8C52" }}
          ></div>
          <div
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: "#FF6B00" }}
          ></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default SubmissionsHeatMap;
