/**
* Fill calendar with year cells
*/
function populate_calendar(baseYear, numYears) {
    const root = document.getElementById("calendar");

    // remove every existing child first, just in case
    while(root.children.length > 0) {
        root.children[0].remove();
    }

    // spawn years
    for (let i = 0; i < numYears; i++) {
        root.appendChild(spawn_year(baseYear + i));
    }
}

function spawn_year(_year) {
    let year_div = document.createElement("div");
    year_div.classList.add("year-wrapper");

    let title = document.createElement("h2");
    title.classList.add("year-label");
    title.innerHTML = _year;
    year_div.appendChild(title);

    let year_cell = document.createElement("div");
    year_cell.classList.add("year-cell");
    year_div.appendChild(year_cell);

    for(let i = 0; i < 12; i++) {
        let month_div = document.createElement("div");
        month_div.classList.add("month-cell");
        for(let j = 0; j < 4; j++) {
            week_div = document.createElement("div");
            week_div.id = `${_year}-${i+1}-${j+1}`;
            week_div.classList.add("week-cell");

            month_div.appendChild(week_div);
        }
        year_cell.appendChild(month_div);
    }

    return year_div;
}

// from https://stackoverflow.com/questions/1184334/get-number-days-in-a-specified-month-using-javascript
// Month in JavaScript is 0-indexed (January is 0, February is 1, etc),
// but by using 0 as the day it will give us the last day of the prior
// month. So passing in 1 as the month number will return the last day
// of January, not February
function days_in_month (month, year) {
    return new Date(year, month, 0).getDate();
}

function get_week_id_from_date(date) {
    let n_days = days_in_month(date.getMonth() + 1, date.getFullYear())
    let week_number = Math.floor((date.getDate()-1) / (n_days / 4));
    return `${date.getFullYear()}-${date.getMonth()+1}-${week_number + 1}`;
}

function write_life_event(life_event) {
    // console.log(life_event['date']);
    let id = get_week_id_from_date(life_event['date']);
    console.log(id)
    week_div = document.getElementById(id);

    week_div.classList.add("has-tooltip");

    week_div.dataset.tooltip = life_event['description'];
    week_div.insertAdjacentHTML('beforeend', life_event['icon']);
}


events = [
    {
        'date': new Date("1990-02-05"),
        'description': "I was born",
        'icon': "👶"
    },
    {
        'date': new Date("2011-05-13"),
        'description': "Started dating",
        'icon': "♥️"
    },
    {
        'date': new Date("2012-06-30"),
        'description': "Graduated",
        'icon': "🎓"
    },
]



let calendar = document.getElementById("calendar");
populate_calendar(1990, 60);

events.forEach(e => {
    write_life_event(e);
});

