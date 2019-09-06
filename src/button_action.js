function clear_data() {
  let table;
  for (var i = 0; i < 3; i++) {
    let table_column = document.getElementsByClassName("td_" + i);
    table[i] = table_column;
  }
  console.log(table);
}

function pay() {}
