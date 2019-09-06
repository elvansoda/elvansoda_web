function cancel() {
  console.log("Cancel button clicked");
  window.open(
    "pup_clear.html",
    "c",
    "width=500, height=220, left=450, top=250"
  );
}

function pay() {
  console.log("Pay button clicked");
  window.open("pup_pay.html", "p", "width=500, height=220, left=450, top=250");
}
