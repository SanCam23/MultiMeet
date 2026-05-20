const fs = require('fs');
const path = "c:\\Users\\donat\\Desktop\\Ingenieria Multimedia\\Ussabilidad y Accesibilidad\\MultiMeet\\src\\app\\upload\\page.jsx";
let content = fs.readFileSync(path, 'utf8');

// The new form
content = content.replace(
  `{formType === "new" ? (\r\n            <form onSubmit={handleSubmit} className="space-y-8">`,
  `{formType === "new" ? (\r\n            <form onSubmit={handleSubmit} className="space-y-8" noValidate>`
);
// The extend form
content = content.replace(
  `{formType === "extend" && (\r\n            <form onSubmit={handleSubmit} className="space-y-8">`,
  `{formType === "extend" && (\r\n            <form onSubmit={handleSubmit} className="space-y-8" noValidate>`
);
content = content.replace(
  `          ) : (\r\n            <form onSubmit={handleSubmit} className="space-y-8">`,
  `          ) : (\r\n            <form onSubmit={handleSubmit} className="space-y-8" noValidate>`
); // fallback if conditional isn't exactly &&

fs.writeFileSync(path, content);
console.log("noValidate added.");
