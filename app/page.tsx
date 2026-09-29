import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/locales/config";

// Корень "/" перенаправляет на язык по умолчанию.
// (Определение языка браузера добавим на этапе middleware — задел заложен.)
export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}`);
}
