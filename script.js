// создать проект с webpack
// перевести всю логину на ООП

// import Render from Render
//
//
// class Calendar {
//
//   render = new Render();
//
//   constructor(){
//       this.render.renderView()
//   }
//
//
//
// }
//
//
// class Render {
//
//   renderView(){}
// }

//
// const calentdar = new Calendar();
// calentdar.ini....


export class Calendar {
  mainContainer;

  constructor(container) {
    this.mainContainer = document.querySelector(container);
  }

  init(){
    
  }

}


const mainContainer = document.querySelector(".container");

const date = new Date();
// актуализируем ее
let actualDate;

//календарь или задачи
let isCalendar = true;

// тут все названия и колличества дней в месяце
const NAMES = {
  days: ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
  daysFull: [
    "понедельник",
    "вторник",
    "среда",
    "четверг",
    "пятница",
    "суббота",
    "воскресенье",
  ],
  daysCastom: [
    "ебаное начало",
    "ебаная работа",
    "ебаный ад",
    "ебаные встречи",
    "ебаный конец",
    "ебаные клубы",
    "ебаный отсыпной",
  ],
  daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  month: [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь",
  ],
  monthCastom: [
    "ебаный новый год",
    "ебаный холод",
    "ебаная грязь",
    "ебаные шутники",
    "ебаный день труда",
    "ебаные школьники",
    "ебаная жара",
    "ебаный отпуск",
    "ебаное 3 сентября",
    "ебаный дождь",
    "ебаные скидки",
    "ебаные подарки",
  ],
};

initializeCalendar(isCalendar);


function initializeCalendar(isCalendar) {
    actualDate = getDate();
    renderViewTitle();
    renderViewSubTitle(date.getMonth());
    NAMES.daysInMonth[1] = actualDate.year % 4 == 0 ? 29 : 28;
    isCalendar ? renderViewCalendar() : renderViewTickets();

    subscribeOnEvents();
}


function switchCalendar() {
    isCalendar = !isCalendar;
    this.innerHTML = isCalendar ? "ебаные задачи" : "ебаный календарь";
    initializeCalendar(isCalendar);
}

// functions

function subscribeOnEvents() {
  mainContainer.removeEventListener('click', eventListener);
  mainContainer.addEventListener("click", eventListener);
}

function eventListener(event) {
    if (event.target.localName === "i" || event.target.localName === "button") {

      console.log('target', event.target.classList.value)

        switch (event.target.classList.value) {
            case "control-btn":
                switchCalendar();
                break;
            case "las la-caret-left":
                isCalendar ? prevOrNextMonth() : numberDayToday();
                break;
            case "las la-caret-right":
                isCalendar ? prevOrNextMonth(true) : numberDayToday();
                break;
            case "btn-reset":
                NAMES.daysInMonth[1] = actualDate.year % 4 == 0 ? 29 : 28;

                actualDate = getDate();

                removeContainer(".navigate");
                removeContainer(".weeks");

                renderViewSubTitle(actualDate.month - 1);
                renderViewCalendar();
                break;
            case "day-btn":
                console.log(event.target.innerText);
                break;
            case "day-btn active-day":
                console.log(event.target.innerText);
                break;
            default:
                break;
        }
    }
}

// создание и отрисовка календаря
function makeCalendar(monthArr) {
  const weeks = conteinerCreator("ul", "weeks");

  let dayNumber = 0;

  for (let i = 0; i < 7; i++) {
    dayNumber = i;
    // добавление всякой херни в контейнер
    const daysName = conteinerCreator("h6", "days-name");
    daysName.innerHTML = NAMES.days[i];

    const days = conteinerCreator("ul", "days");

    for (let j = 0; j < 6; j++) {
      const day = conteinerCreator("li", "day");
      const dayBtn = conteinerCreator("button", "day-btn");
      // заполнение списков числами
      dayBtn.innerHTML = monthArr[dayNumber + j * 6];
      if (monthArr[dayNumber + j * 6] !== null) {
        day.append(dayBtn);
      }
      // а это так, выделялка нынешнего дня
      if (dayBtn.innerHTML == actualDate.day) {
        if (
          //если совпадает год месяц и день - красная
          actualDate.month === getDate().month &&
          actualDate.year === getDate().year
        ) {
          dayBtn.classList.add("active-day");
        }
      }

      dayNumber++;
      days.append(day);
    }
    days.prepend(daysName);
    weeks.appendChild(days);
  }

  return weeks;
}

// ебаные названия месяца или дня недели
function makeCastomTitle(actual, isMonth = true) {
  const castomTitle = isMonth
    ? NAMES.monthCastom[actual - 1]
    : NAMES.daysCastom[actual - 1];

  document.querySelector(".castom-title").innerHTML =
    castomTitle.toUpperCase() ?? castomTitle;
  document.querySelector(".name-month").innerHTML = isMonth
    ? NAMES.month[actual - 1]
    : NAMES.daysFull[actual - 1];
}

// создание списка дней в месяце с пустыми днями недели
function makeMonth(thatYear, month) {
  const listForShowingCalendar = [];

  const dayOff = getMonthStartOffset(thatYear, month);
  let daysInMonth = NAMES.daysInMonth[month - 1];

  for (let i = 0; i < daysInMonth; i++) {
    listForShowingCalendar.push(i + 1);
  }
  for (let i = 0; i < dayOff; i++) {
    listForShowingCalendar.unshift(null);
  }

  let lastDayOff = 42 - listForShowingCalendar.length;
  if (listForShowingCalendar.length < 42) {
    for (let i = 0; i < lastDayOff; i++) {
      listForShowingCalendar.push(null);
    }
  }
  return listForShowingCalendar;
}

// создание и отрисовка задач
function makeTickets() {
  const dayTickets = conteinerCreator("ul", "day-tickets");

  for (let i = 0; i < 24; i++) {
    const hour = conteinerCreator("li", "hour");
    const hourSpan = conteinerCreator("span", "hour-span");
    const ticketInput = conteinerCreator("input", "ticket-input");

    hourSpan.innerHTML = i < 10 ? `0${i}:00` : `${i}:00`;

    hour.append(hourSpan);
    hour.append(ticketInput);
    dayTickets.append(hour);
  }
  return dayTickets;
}

function conteinerCreator(nameElement, nameClass = "") {
  const element = document.createElement(nameElement);
  element.classList.add(nameClass);

  return element;
}

// получить актуальную дату
function getDate() {
  const d = new Date();
  return {
    day: d.getUTCDate(),
    month: d.getMonth() + 1,
    year: d.getFullYear(),
  };
}

function prevOrNextMonth(increment) {
  increment ? actualDate.month++ : actualDate.month--;

  let monthNumber = actualDate.month;

  if (monthNumber > 12) {
    monthNumber = 1;
    actualDate.year++;
  } else if (monthNumber < 1) {
    monthNumber = 12;
    actualDate.year--;
  }

  actualDate.month = monthNumber;
  NAMES.daysInMonth[1] = actualDate.year % 4 == 0 ? 29 : 28;
  makeCastomTitle(monthNumber);
  removeContainer(".weeks");
  renderViewCalendar();
}

// возвращает индекс для недели если нету то -1
// сделать рендер дня !!!
function numberDayToday() {
  console.log('numberDayToday')
  const today = date.toLocaleString("ru-RU", { weekday: "long" });
  const day =  NAMES.daysFull.reduce((acc, el, ind) => {
    acc = el.includes(today) ? ind : acc;
    return acc;
  }, -1);

  renderViewSubTitle(day)

}

function renderViewTitle() {
  removeContainer(".title");
  const template = `
        <div class="title">
            <h1 class="title-name root-color-text"> ${
              isCalendar ? "EБАНЫЙ" : "EБАНЫЕ"
            }</h1>
            <span class="name-span root-color-text">${
              isCalendar ? "календарь" : "задачи"
            }</span>
            <span class="year">${actualDate.year}</span>
         </div>
    `;
  renderTemplate(mainContainer, template);
}

function renderViewSubTitle(monthOrDayNumber) {
  removeContainer(".navigate");

  const template = `<div class="navigate">
        <button class="arrow prev"><i class="las la-caret-left"></i></button>

        <div class="month">
          <h3 class="castom-title">${
            isCalendar
              ? NAMES.monthCastom[monthOrDayNumber].toUpperCase()
              : NAMES.daysCastom[monthOrDayNumber - 1].toUpperCase()
          }</h3>
          <h3 class="name-month root-color-text">${
            isCalendar
              ? NAMES.month[monthOrDayNumber]
              : NAMES.daysFull[monthOrDayNumber - 1]
          }</h3>
        </div>

        <button class="arrow next"><i class="las la-caret-right"></i></button>
      </div>`;
  renderTemplate(mainContainer, template);
}

function renderViewCalendar() {
  removeContainer(".tickets-box");
  removeContainer(".data-box");

  const template = `<div class="data-box">${
    makeCalendar(makeMonth(actualDate.year, actualDate.month)).outerHTML
  }
        <button class="btn-reset">вернуться в ебаное сегодня</button>
      </div>`;
  renderTemplate(mainContainer, template);
}

function renderViewTickets() {
  removeContainer(".data-box");

  const template = `<div class="tickets-box">${makeTickets().outerHTML}</div>
    </div>`;
  renderTemplate(mainContainer, template);
}

//create template
function renderTemplate(container, template) {
  container.insertAdjacentHTML("beforeend", template);
}

// removed container
function removeContainer(containerClass) {
  const container = document.querySelector(containerClass);
  if (container) {
    container.remove();
  }
}

// костыль для рассчета дня недели для даты
function getMonthStartOffset(thatYear, month) {
  const firstDay = 0;

  if (month < 3) {
    month += 12;
    thatYear -= 1;
  }
  let k = thatYear % 100;
  let j = Math.floor(thatYear / 100);
  let f =
    firstDay +
    Math.floor((13 * (month + 1)) / 5) +
    k +
    Math.floor(k / 4) +
    Math.floor(j / 4) -
    2 * j;

  return ((((f % 7) + 7) % 7) + 6) % 7;
}
