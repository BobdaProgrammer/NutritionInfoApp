document.addEventListener("DOMContentLoaded", function () {
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, "0");
      let mm = String(today.getMonth() + 1).padStart(2, "0");
      let yyyy = today.getFullYear();
      //the british way 😃:
      today = dd + "/" + mm + "/" + yyyy;
    loadmeals("breakfast",today)
    loadmeals("lunch",today)
    loadmeals("dinner",today)
    loadmeals("snack",today)
    document.querySelectorAll(".valpick").forEach(picker =>  {
      picker.addEventListener("input", function (event) {
        event.target.parentElement.children[2].innerText = event.target.value;
      })
    });
});

function loadmeals(mealname,today) {
  let meal = localStorage.getItem(mealname);
  let section = document.querySelector("." + mealname)
  if (meal != null) {
      let res = `<strong>${
        mealname[0].toUpperCase() + mealname.slice(1, mealname.length)
      }:</strong><br>`;
    meal = JSON.parse(meal)
    if (meal[0] == today) {
      meal = meal.slice(1, meal.length);
      for (let i = 0; i < meal.length; i++) {
        res += `<label>`
        let vals = meal[i].split(",")[1]
        let name = meal[i].split(",")[0]
        res += `<p>${name}</p><select class="valpick">`
        vals = vals.split("<br>")
        let firstval = 0
        for (let i = 0; i < vals.length - 1; i++) {
          let parts = vals[i].split(": ");
          let key = parts[0];
          let val = parts[1];
          if (i == 0) firstval = val
          res += `<option value='${val}'>${key}</option>`
        }
        res += "</select>"
        res += `<p>${firstval}</p></label>`;
      }
    }
      section.innerHTML = res;
  }
}


const scanner = new Html5QrcodeScanner("reader", {
  qrbox: {
    width: 250,
    height: 250,
  },
  fps: 50,
});
scanner.render(success, error);

function findIndexWithSubstring(array, substring) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].includes(substring)) {
      return i;
    }
  }
  return -1;
}

function meal(mealname) {
  let meal = localStorage.getItem(mealname);
  if (meal == null) {
    meal = [];
  } else {
    meal = JSON.parse(meal);
  }
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();
  //the british way 😃:
  today = dd + "/" + mm + "/" + yyyy;
  meal[0] = today;
  let item = document.getElementById("custom");
  if (item.innerHTML.length == 0) {
    item = document.getElementById("hundred");
  }
  let res =
    document.getElementById("name").innerText +
    "," +
    item.innerHTML.slice(item.id == "hundred" ? 0 : 23, item.innerHTML.length);
  let pos = findIndexWithSubstring(
    meal,
    document.getElementById("name").innerText
  );
  if (pos != -1) {
    meal[pos] = res;
    localStorage.setItem(mealname, JSON.stringify(meal));
    return;
  }
  meal.push(res);
  localStorage.setItem(mealname, JSON.stringify(meal));
}

function custom(event) {
  let hundred = document.getElementById("hundred").innerHTML;
  hundred = hundred.split("<br>");
  let custom = document.getElementById("custom");
  custom.innerHTML = "<h4>Custom values:</h4>";
  for (let i = 0; i < hundred.length - 1; i++) {
    let splitline = hundred[i].split(": ");
    custom.innerHTML +=
      splitline[0] +
      ": " +
      (Number(splitline[1]) * (Number(event.target.value) / 100)).toFixed(2) +
      "<br>";
  }
}

function score(lett, scoreType) {
  let nutri = "";
  nutri += `<span id='nutri'>${scoreType}</span>`;
  nutri +=
    lett == "a"
      ? "<label for='nutri' style='color:green;'>A</label>"
      : lett == "b"
      ? "<label for='nutri' style='color:blue;'>B</label>"
      : lett == "c"
      ? "<label for='nutri' style='color:orange;'>C</label>"
      : `<label for='nutri' style='color:red;'>${lett.toUpperCase()}</label>`;
  return nutri;
}

function success(result) {
  console.log(result);
  let resultEl = document.getElementById("result");
  resultEl.style.display = "block";
  document.getElementById("imghold").style.display = "block";
  resultEl.innerHTML = `found. Qrcode: ${result}. retrieving data...`;
  fetch(`https://world.openfoodfacts.org/api/v2/product/${result}.json`)
    .then((response) => {
      if (response.status == "0") {
      }
      return response.json();
    })
    .then((data) => {
      if (data.status == 0) {
        resultEl.innerHTML =
          "<div style='text-align: center;'>Could't find item please try again<br><button onclick='location.reload()'>Try again</button></div>";
        return;
      }
      console.log(data)
      document.getElementById(
        "imghold"
      ).innerHTML = `</div><img src="${data["product"]["image_url"]}"><br>`;
      let nutriments = data["product"]["nutriments"];
      let name = "";
      let val = 0;
      let serve = false;
      let allergenslist = data["product"]["allergens_from_ingredients"]
        .replace(/ /g, "")
        .split(",");
      let allergens = [...new Set(allergenslist)];
      allergens = allergens.join(", ");
      resultEl.innerHTML = `<center><button onclick="location.reload()">Scan new item</button><h2 id="name">${data["product"]["product_name"]}</h2><h5>Last updated: ${data["product"]["last_edit_dates_tags"][0]}</h5>Add to:<br><button onclick="meal('breakfast')">Breakfast</button><button onclick="meal('lunch')">Lunch</button><button onclick="meal('dinner')">Dinner</button><button onclick="meal('snack')">Snack</button><br><input value=100 style="margin-top: 8px" class="selector" type="number" onchange="custom(event)" min=0>g</center><div id="custom"></div></center><br>Additives: ${data["product"]["additives_n"]}<br>Allergens found in ingredients: ${allergens}<br><h4>Typical values per 100g:</h4>`;
      let res = `<div id="hundred">`;
      // Loop through the keys of the nutriments object
      Object.keys(nutriments).forEach((key) => {
        if (!key.includes("_")) {
          if (name == "" || !key.startsWith(name)) {
            name = key;
            val = nutriments[key];
            serve = true;
          }
        } else if (serve && key.endsWith("_unit")) {
          let unit = nutriments[key];
          res +=
            name[0].toUpperCase() +
            name.slice(1, name.length) +
            ` (${unit}): ${val}<br>`;
          serve = false;
        }
      });
      res += "</div>";
      if (nutriments["carbohydrates_serving"] != undefined) {
        res += `<h4>Typical values per serving (${
          (nutriments["carbohydrates_serving"] /
            nutriments["carbohydrates_value"]) *
          100
        }g): </h4>`;
        Object.keys(nutriments).forEach((key) => {
          if (key.endsWith("_serving")) {
            name = key.split("_")[0].split("-").join(" ");
            val = nutriments[key];
            serve = true;
          } else if (serve) {
            if (key.endsWith("_unit")) {
              let str = key.split("-");
              let unit = nutriments[key];
              if (
                str.length == 1 ||
                !str[1].toLowerCase().startsWith(unit.toLowerCase())
              ) {
                res +=
                  name[0].toUpperCase() +
                  name.slice(1, name.length) +
                  ` (${unit}): ${val}<br>`;
              }
            }
            serve = false;
          }
        });
      }
      res += "<h5>Ingredients:</h5>";
      for (let i = 0; i < data["product"]["ingredients"].length; i++) {
        res +=
          `<li>${data["product"]["ingredients"][i]["text"]}</li><br>`.replace(
            /_/g,
            ""
          );
      }
      let nutriscore = data["product"]["nutriscore_grade"];
      res += score(nutriscore, "Nutri Score: ") + "<br>";
      let ecoscrore = data["product"]["ecoscore_grade"];
      res += score(ecoscrore, "Eco Score: ")+"<br>";
      let novascore = Number(data["product"]["nova_group"]);
      console.log(novascore)
      res += nova(novascore, "Nova group: ");
      resultEl.innerHTML += res;
    })
    .catch((error) => {});
  scanner.clear();
}
function error(err) { }
function nova(score, text) {
    let nutri = "";
    nutri += `<span id='nova'>${text}</span>`;
    nutri +=
      score == 1
        ? "<label for='nova' style='color:green;'>1</label>"
        : score == 2
        ? "<label for='nova' style='color:blue;'>2</label>"
        : score == 3
        ? "<label for='nova' style='color:orange;'>3</label>"
        : `<label for='nova' style='color:red;'>${isNaN(score)?score.toUpperCase():score}</label>`;
    return nutri;
}
