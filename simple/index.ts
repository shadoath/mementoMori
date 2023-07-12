// You need to explicitly declare types for your constants and variables.
interface RectangleDimensions {
  rows: number;
  cols: number;
}

const life_expectancy: number = 90;
let numDecades: number = Math.floor(life_expectancy / 10);
populate_calendar(numDecades);
fill_calendar("04/05/1992");

const DAYS_PER_YEAR: number = 365;
const DAYS_PER_WEEK: number = 7;

const rows_per_rect: string = get_css_variable("--rows-per-rect");
const cols_per_rect: string = get_css_variable("--cols-per-rect");

let calendar: HTMLElement | null = document.getElementById("calendar");

function getNumberFromCSSVar(name: string): number {
  const value: string = getComputedStyle(
    document.documentElement
  ).getPropertyValue(name);
  return Number(value);
}

function fill_calendar(bday: string) {
  let [day, month, year]: string[] = bday.split("/");
  bday = `${month}/${day}/${year}`;

  let bdayDate: Date = new Date(bday);
  let now: Date = new Date();
  let day_diff: number =
    (now.getTime() - bdayDate.getTime()) / (1000 * 3600 * 24);

  let years: number = Math.floor(day_diff / 365);
  let remaining_weeks: number = Math.floor((day_diff % 365) / 7);

  let num_weeks: number = years * 26 * 2 + remaining_weeks;

  for (let week = 0; week < num_weeks; week++) {
    paint_week(week);
  }
}

function paint_week(num: number): void {
  const week: HTMLElement | null = document.getElementById(`week-${num}`);
  if (week != null) {
    week.style.backgroundColor = get_css_variable("--color-dark-gray");
  }
}

function set_ids(numDecades: number): void {
  const weeks_per_year: number = Number(cols_per_rect) * 2;
  const weeks_per_decade: number = weeks_per_year * 10;

  for (let decade = 0; decade < numDecades; decade++) {
    const decade_weeks: number = decade * weeks_per_decade;
    for (let rect = 0; rect < 2; rect++) {
      const r: HTMLElement | null = document.getElementById(
        `rect-${decade}-${rect}`
      );
      const rect_weeks: number = rect * Number(cols_per_rect);
      if (r != null) {
        r.childNodes.forEach((cell: ChildNode, index: number) => {
          let rect_rows: number = Math.floor(index / 26);
          let offset: number = index % Number(cols_per_rect);
          let id: number =
            decade_weeks + rect_rows * weeks_per_year + rect_weeks + offset;
          (cell as HTMLElement).id = `week-${id}`;
        });
      }
    }
  }
}

function populate_calendar(numDecades: number): void {
  for (let i = 0; i < numDecades; i++) {
    spawn_decade(i);
  }

  set_ids(numDecades);
}

function spawn_decade(decade: number): void {
  for (let i = 0; i < 2; i++) {
    const rect: HTMLElement = spawn_rectangle(
      Number(rows_per_rect),
      Number(cols_per_rect)
    );
    rect.id = `rect-${decade}-${i}`;
    if (calendar != null) {
      calendar.appendChild(rect);
    }
  }
}

function spawn_rectangle(rows: number, cols: number): HTMLElement {
  const rect: HTMLElement = document.createElement("div");
  rect.classList.add("rect-container");

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      rect.appendChild(spawn_cell());
    }
  }
  return rect;
}

function spawn_cell(): HTMLElement {
  const div: HTMLElement = document.createElement("div");
  div.classList.add("week-cell");
  return div;
}

function get_css_variable(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}
