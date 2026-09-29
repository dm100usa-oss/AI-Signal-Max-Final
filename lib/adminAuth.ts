// Проверка пароля модератора отзывов — только на сервере.
// Пароль больше не хранится в коде страницы и не виден в браузере.
// Задаётся в настройках хостинга переменной ADMIN_PASSWORD;
// пока она не задана, действует прежний пароль.
export function isAdminRequest(req: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD || "admin123";
  const given = req.headers.get("x-admin-password") || "";
  return given.length > 0 && given === expected;
}
