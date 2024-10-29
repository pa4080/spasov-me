import { redirect } from "next/navigation";

// import { getSession } from "@/components/_common.actions";

export default async function RedirectToLab() {
  // const session = await getSession();

  // if (!session?.user) {
  //   redirect("/portfolio");
  // }

  redirect("/lab");
}
