const fs = require('fs');
const path = "c:\\Users\\donat\\Desktop\\Ingenieria Multimedia\\Ussabilidad y Accesibilidad\\MultiMeet\\src\\app\\upload\\page.jsx";
let content = fs.readFileSync(path, 'utf8');

// The extend form date and time inputs:
content = content.replace(
  `<Input id="extDate" type="date"`,
  `<Input id="extDate" ref={dateRef} type="date"`
);
content = content.replace(
  `<Input id="extTime" type="time"`,
  `<Input id="extTime" ref={timeRef} type="time"`
);

fs.writeFileSync(path, content);
console.log("Fixed extDate and extTime refs");
