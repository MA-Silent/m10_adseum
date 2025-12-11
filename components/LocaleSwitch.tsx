import { CmsComponent } from "../src/components/componentType";
import { cookies as getCookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function switchLocale() {
  "use server"
  const cookies = await getCookies();
  const locale = cookies.get('x-lang') || { value: "en"};

  if(locale.value == "en"){
    cookies.set("x-lang", "nl")
  } else if(locale.value == "nl"){
    cookies.set("x-lang", "en")
  }
  revalidatePath('/');
}

const LocaleSwitch: CmsComponent = async ({ children }) => {

  const cookies = await getCookies();

  return (
    <div className="relative inline-block">
      <div className="size-fit relative flex items-center">
        English
        <input type="checkbox" id="localSwitcher" className="absolute inset-0 peer appearance-none z-10" onClick={switchLocale} defaultChecked={ cookies.get('x-lang')?.value == 'nl' } />
        <div className="border-2 group w-18 h-8 rounded-full p-2">
          <div className="size-full relative flex items-center">
            <div className="size-4 bg-chart-1 rounded-full relative transition-[left,translate] left-0 group-peer-checked:left-full group-peer-checked:-translate-x-full"></div>
          </div>
        </div>
        Nederlands
      </div>
      { children }
    </div>
  )
}

export default LocaleSwitch;
