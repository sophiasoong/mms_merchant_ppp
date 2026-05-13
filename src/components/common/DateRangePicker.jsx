import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January','February','March','April','May','June',
                 'July','August','September','October','November','December'];

// Return Date at midnight local
function ymd(y, m, d) { return new Date(y, m, d); }

// ISO date string YYYY-MM-DD
function toISO(date) {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseISO(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return ymd(y, m - 1, d);
}

function isSameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isBetween(date, start, end) {
  if (!date || !start || !end) return false;
  const t = date.getTime();
  const s = start.getTime(), e = end.getTime();
  return t > Math.min(s, e) && t < Math.max(s, e);
}

// Build a 6-row × 7-col grid for a month, padded with prev/next month days
function buildGrid(year, month) {
  const firstDay = ymd(year, month, 1);
  // Figma uses Mon=0 offset
  let startDow = firstDay.getDay(); // 0=Sun..6=Sat
  startDow = startDow === 0 ? 6 : startDow - 1; // convert to Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev  = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = startDow - 1; i >= 0; i--) {
    cells.push({ date: ymd(year, month - 1, daysInPrev - i), current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: ymd(year, month, d), current: true });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ date: ymd(year, month + 1, cells.length - daysInMonth - startDow + 1), current: false });
  }
  return cells;
}

function CalendarMonth({ year, month, startDate, endDate, hoverDate, onSelect, onPrevMonth, onNextMonth, onPrevYear, onNextYear, isLeft }) {
  const grid = buildGrid(year, month);

  function getCellStyle(date, current) {
    const isStart = isSameDay(date, startDate);
    const isEnd   = isSameDay(date, endDate);
    const hover   = hoverDate && !endDate;
    const inRange = startDate && (endDate
      ? isBetween(date, startDate, endDate)
      : hover && isBetween(date, startDate, hoverDate));
    const isToday = isSameDay(date, new Date());

    let bg = 'transparent', color = current ? '#1E1E1E' : '#A6A6A6', fontWeight = 400, radius = '6px';

    if (isStart || isEnd) {
      bg = '#5244EE'; color = '#fff'; fontWeight = 500;
      radius = isStart ? '6px 0 0 6px' : '0 6px 6px 0';
      if (isStart && isEnd) radius = '6px';
    } else if (inRange) {
      bg = '#F7F6FF'; color = '#5244EE';
      radius = '0';
    }
    if (isToday && !isStart && !isEnd) {
      color = '#5244EE';
    }

    return { bg, color, fontWeight, radius };
  }

  return (
    <div style={{ width: 280, flexShrink: 0 }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 40, padding: '0 8px',
        background: '#fff', borderBottom: '1px solid #F4F4F4',
      }}>
        {/* Prev buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          {isLeft && (
            <button onClick={onPrevYear} style={navBtnStyle} title="Previous year">
              «
            </button>
          )}
          {isLeft && (
            <button onClick={onPrevMonth} style={navBtnStyle} title="Previous month">
              ‹
            </button>
          )}
        </div>

        {/* Month Year label */}
        <span style={{ fontSize: 14, color: '#1E1E1E', fontWeight: 500 }}>
          {MONTHS[month]} {year}
        </span>

        {/* Next buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          {!isLeft && (
            <button onClick={onNextMonth} style={navBtnStyle} title="Next month">
              ›
            </button>
          )}
          {!isLeft && (
            <button onClick={onNextYear} style={navBtnStyle} title="Next year">
              »
            </button>
          )}
        </div>
      </div>

      {/* Day grid */}
      <div style={{ background: '#fff', padding: '8px 12px' }}>
        {/* Day-of-week header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 0 }}>
          {DAYS.map(d => (
            <div key={d} style={{
              width: 36, height: 30,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, color: '#1E1E1E', textAlign: 'center',
            }}>{d}</div>
          ))}
        </div>

        {/* Weeks */}
        {Array.from({ length: grid.length / 7 }, (_, wi) => (
          <div key={wi} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 6px' }}>
            {grid.slice(wi * 7, wi * 7 + 7).map(({ date, current }, di) => {
              const { bg, color, fontWeight, radius } = getCellStyle(date, current);
              return (
                <div
                  key={di}
                  onClick={() => onSelect(date)}
                  onMouseEnter={() => {}}
                  style={{
                    width: 24, height: 24, padding: 2, borderRadius: radius,
                    background: bg, color, fontWeight, fontSize: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', userSelect: 'none', textAlign: 'center',
                    transition: 'background 0.1s',
                  }}
                  onMouseOver={e => {
                    if (bg === 'transparent') e.currentTarget.style.background = '#F7F6FF';
                  }}
                  onMouseOut={e => {
                    if (bg === 'transparent') e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

const navBtnStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontSize: 18, color: '#5C5C5C', width: 22, height: 40,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: 0, lineHeight: 1,
};

export default function DateRangePicker({ anchorRect, startDate, endDate, onStartChange, onEndChange, onClose }) {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [hoverDate, setHoverDate] = useState(null);

  const start = parseISO(startDate);
  const end   = parseISO(endDate);

  const rightMonth = (viewMonth + 1) % 12;
  const rightYear  = viewMonth === 11 ? viewYear + 1 : viewYear;

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }
  function prevYear()  { setViewYear(y => y - 1); }
  function nextYear()  { setViewYear(y => y + 1); }

  function handleSelect(date) {
    if (!start || (start && end)) {
      onStartChange(toISO(date));
      onEndChange('');
    } else {
      if (date < start) {
        onEndChange(toISO(start));
        onStartChange(toISO(date));
      } else {
        onEndChange(toISO(date));
      }
    }
  }

  function handleToday() {
    const t = new Date();
    onStartChange(toISO(t));
    onEndChange(toISO(t));
  }

  // Position below the anchor element using fixed coords
  const top  = anchorRect ? anchorRect.bottom + 8 : 100;
  const left = anchorRect ? anchorRect.left       : 100;

  const panel = (
    <div
      data-date-picker="true"
      onClick={e => e.stopPropagation()}
      style={{
        position: 'fixed',
        top, left,
        zIndex: 9999,
        display: 'flex', flexDirection: 'column',
        width: 560, borderRadius: 6,
        boxShadow: '0px 2px 12px rgba(0,0,0,.15)',
        background: '#fff', overflow: 'hidden',
        border: '1px solid #F4F4F4',
      }}
    >
      {/* Two calendars */}
      <div style={{ display: 'flex', borderBottom: '1px solid #F4F4F4' }}>
        <CalendarMonth
          year={viewYear} month={viewMonth}
          startDate={start} endDate={end} hoverDate={hoverDate}
          onSelect={handleSelect}
          onPrevMonth={prevMonth} onNextMonth={nextMonth}
          onPrevYear={prevYear}   onNextYear={nextYear}
          isLeft={true}
        />
        <div style={{ width: 1, background: '#F4F4F4', flexShrink: 0 }} />
        <CalendarMonth
          year={rightYear} month={rightMonth}
          startDate={start} endDate={end} hoverDate={hoverDate}
          onSelect={handleSelect}
          onPrevMonth={prevMonth} onNextMonth={nextMonth}
          onPrevYear={prevYear}   onNextYear={nextYear}
          isLeft={false}
        />
      </div>

      {/* Footer */}
      <div style={{
        height: 42, background: '#fff', borderTop: '1px solid #F4F4F4',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px',
      }}>
        {/* Reset — ghost text button, left */}
        <button
          onClick={() => { onStartChange(''); onEndChange(''); }}
          style={{
            height: 28, padding: '0 8px',
            background: 'none', border: 'none', borderRadius: 6,
            cursor: 'pointer', fontSize: 13, color: '#5244EE',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          Clear All
        </button>
        {/* OK — filled primary button, right */}
        <button
          onClick={() => onClose && onClose()}
          style={{
            height: 28, padding: '0 14px',
            background: '#5244EE', border: '1px solid #5244EE', borderRadius: 6,
            cursor: 'pointer', fontSize: 13, color: '#fff',
            fontFamily: 'Roboto, sans-serif', fontWeight: 500,
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );

  return createPortal(panel, document.body);
}
