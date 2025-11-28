import { redirect } from "next/navigation";

export default async function CMS() {
  redirect('/cms/home')
  return (
    <div>test</div>
  );
}
