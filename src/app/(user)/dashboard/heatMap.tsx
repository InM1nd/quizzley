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

  // Создаем массив дат для текущего месяца (только для мобильных)
  const generateCurrentMonthDates = () => {
    const dates = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // Первый день месяца
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    // Последний день месяца
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Находим первое воскресенье перед началом месяца
    const firstSunday = new Date(firstDayOfMonth);
    const dayOfWeek = firstSunday.getDay();
    if (dayOfWeek !== 0) {
      firstSunday.setDate(firstSunday.getDate() - dayOfWeek);
    }

    // Находим последнюю субботу после конца месяца
    const lastSaturday = new Date(lastDayOfMonth);
    const lastDayOfWeek = lastSaturday.getDay();
    if (lastDayOfWeek !== 6) {
      lastSaturday.setDate(lastSaturday.getDate() + (6 - lastDayOfWeek));
    }

    // Генерируем все даты от первого воскресенья до последней субботы
    for (
      let d = new Date(firstSunday);
      d <= lastSaturday;
      d.setDate(d.getDate() + 1)
    ) {
      dates.push(new Date(d));
    }
    return dates;
  };

  const allDates = generateDates();
  const currentMonthDates = generateCurrentMonthDates();

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

  // Группируем даты по неделям для полного года
  const createWeeks = (dates: Date[]) => {
    const weeks: Date[][] = [];
    for (let i = 0; i < dates.length; i += 7) {
      const week = dates.slice(i, i + 7);
      // Дополняем неделю до 7 дней, если нужно
      while (week.length < 7) {
        const lastDate = new Date(week[week.length - 1]);
        lastDate.setDate(lastDate.getDate() + 1);
        week.push(lastDate);
      }
      weeks.push(week);
    }
    return weeks;
  };

  const fullYearWeeks = createWeeks(allDates);
  const currentMonthWeeks = createWeeks(currentMonthDates);

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

  // Функция для определения, нужно ли показывать месяц (для полного года)
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
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - 35,
        visible: true,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  // Рендерим разные версии для мобильных и десктопа
  const renderMobileVersion = () => {
    const today = new Date();
    const currentMonthName = getMonthName(today);

    return (
      <div className="w-full">
        {/* Заголовок текущего месяца */}
        <div className="text-center mb-4">
          <h4 className="text-sm font-medium text-gray-300">
            {currentMonthName} {today.getFullYear()}
          </h4>
        </div>

        <div className="flex items-start gap-1">
          {/* Дни недели */}
          <div className="flex flex-col gap-1 pt-6 flex-shrink-0">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div
                key={index}
                className="h-3 w-6 text-xs text-gray-500 text-center flex items-center justify-center"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Недели текущего месяца */}
          <div className="flex gap-1 flex-1 justify-center">
            {currentMonthWeeks.map((week, weekIndex) => (
              <div
                key={weekIndex}
                className="flex flex-col gap-1"
              >
                {/* Пустое место для выравнивания */}
                <div className="h-6"></div>

                {/* Ячейки недели */}
                {week.map((date, dayIndex) => {
                  const dateStr = convertDateToString(date);
                  const count = dataMap.get(dateStr) || 0;
                  const color = getCellColor(count);

                  // Проверяем, принадлежит ли дата текущему месяцу
                  const isCurrentMonth = date.getMonth() === today.getMonth();
                  const opacity = isCurrentMonth ? "opacity-100" : "opacity-30";

                  return (
                    <div
                      key={dayIndex}
                      className={`w-8 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:scale-110 hover:ring-1 hover:ring-orange-400/50 ${opacity}`}
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
      </div>
    );
  };

  const renderDesktopVersion = () => (
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
        {fullYearWeeks.map((week, weekIndex) => (
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
  );

  return (
    <div className="w-full relative heatmap-container">
      {/* Показываем разные версии в зависимости от размера экрана */}
      <div className="block sm:hidden">{renderMobileVersion()}</div>
      <div className="hidden sm:block">{renderDesktopVersion()}</div>

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
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 justify-center sm:justify-start">
        <span>Less</span>
        <div className="flex gap-1">
          <div
            className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm"
            style={{ backgroundColor: "#1c1917" }}
          ></div>
          <div
            className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm"
            style={{ backgroundColor: "#FFCCAA" }}
          ></div>
          <div
            className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm"
            style={{ backgroundColor: "#FFA07A" }}
          ></div>
          <div
            className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm"
            style={{ backgroundColor: "#FF8C52" }}
          ></div>
          <div
            className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm"
            style={{ backgroundColor: "#FF6B00" }}
          ></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default SubmissionsHeatMap;
