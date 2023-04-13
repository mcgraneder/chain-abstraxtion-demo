import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import { Dialog } from "@headlessui/react";
import {
  UilTimes,
} from "@iconscout/react-unicons";
import PrimaryButton from "../Buttons/PrimaryButton";
import { useRouter } from "next/router";
import Link from "next/link";
import AstralLogo from "../../../public/images/logo.svg";


export type Slideover = {
  open: boolean;
  setOpen: any;
};


const ROUTES: string[] = ["home", "swap", "wallet", "history"];

const NavLinks = ({
  routes,
  activePath,
}: {
  routes: string[];
  activePath: string;
}) => {
  return (
    <>
      {routes.map((route: string, index: number) => {
        return (
          <Link
            href={`/${route}`}
            key={route}
            className="mx-1 flex-col items-left gap-2 flex"
            id={route}
          >
            <span
              className={`my-2 w-full rounded-xl px-2 py-2 text-left text-[16px] font-[900] ${
                activePath.slice(1, activePath.length) === route
                  ? "text-[rgb(118,69,217)]"
                  : "text-[#7a6eaa]"
              } hover:cursor-pointer hover:bg-[#e9eaeb]`}
            >
              {route}
            </span>
          </Link>
        );
      })}
    </>
  );
};

export default function SlideOver({
  open,
  setOpen,
}: Slideover) {
    const router = useRouter()
  const activePath = router.pathname;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50 " onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-transparent backdrop-blur-md transition-opacity md:opacity-70" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 -right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Overlay className="pointer-events-auto relative w-screen max-w-[320px] bg-white">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md border-primary text-primary focus:ring-2 focus:ring-primary"
                        onClick={() => setOpen(false)}
                      >
                        <UilTimes className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="bg-black-800 flex h-full flex-col px-6 py-6 shadow-xl">
                    <div className="mr-2 items-center">
                      <AstralLogo className=" h-[35px] w-[170px]" />
                    </div>
                    <NavLinks routes={ROUTES} activePath={activePath} />
                  </div>
                </Dialog.Overlay>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
