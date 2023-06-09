import { Link, useLocation } from "@solidjs/router";
import logoURL from "/src/assets/logo.png";
import { AiOutlineCloseCircle } from "solid-icons/ai";
import { Component } from "solid-js";
import { User } from "@supabase/supabase-js";
const Navbar: Component<{
  handleLoginwithGoogle(): Promise<void>;
  signout(): Promise<void>;
  user: User | null;
}> = (props) => {
  return (
    <nav class="px-2 bg-gray-900 border-gray-700">
      <div class="container py-2 flex flex-wrap items-center justify-between mx-auto">
        <Link href="/" class="flex items-center">
          <img src={logoURL} class="h-6 mr-3 sm:h-10" alt="iconlogo" />
          <span class="self-center text-xl font-semibold whitespace-nowrap text-white">
            Trebbo
          </span>
        </Link>
        {/* <button
          data-collapse-toggle="navbar-multi-level"
          type="button"
          class="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-multi-level"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button> */}
        <div
          class="hidden max-sm:fixed z-50 top-0 left-0 max-sm:h-screen bg-gray-900 w-full md:block md:w-auto"
          id="navbar-multi-level"
        >
          <ul class="flex flex-col p-4 mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium  text-white">
            <li>
              <Link
                href="/"
                class="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/timeline"
                class="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
                aria-current="page"
              >
                Timeline
              </Link>
            </li>

            {/* <li>
              <button
                id="dropdownNavbarLink"
                data-dropdown-toggle="dropdownNavbar"
                class="flex items-center justify-between w-full py-2 pl-3 pr-4 font-medium  border-b border-gray-100 hover:bg-gray-500 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-gray-400 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
              >
                Dropdown{" "}
                <svg
                  class="w-4 h-4 ml-1"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
              <div
                id="dropdownNavbar"
                class="z-10 hidden font-normal divide-y divide-gray-100 rounded-lg shadow w-44 bg-gray-700 dark:divide-gray-600"
              >
                <ul
                  class="py-2 text-sm  dark:text-gray-400"
                  aria-labelledby="dropdownLargeButton"
                >
                  <li>
                    <a href="#" class="block px-4 py-2 hover:bg-gray-500 ">
                      Dashboard
                    </a>
                  </li>
                  <li aria-labelledby="dropdownNavbarLink">
                    <button
                      id="doubleDropdownButton"
                      data-dropdown-toggle="doubleDropdown"
                      data-dropdown-placement="bottom"
                      type="button"
                      class="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-500 "
                    >
                      Dropdown
                      <svg
                        aria-hidden="true"
                        class="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </button>
                    <div
                      id="doubleDropdown"
                      class="z-10 hidden bg-slate-500 divide-y divide-gray-100 rounded-lg shadow w-44"
                    >
                      <ul
                        class="py-2 text-sm  dark:text-gray-200"
                        aria-labelledby="doubleDropdownButton"
                      >
                        <li>
                          <a
                            href="#"
                            class="block px-4 py-2 hover:bg-gray-500  dark:text-gray-400"
                          >
                            Overview
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            class="block px-4 py-2 hover:bg-gray-500  dark:text-gray-400"
                          >
                            My downloads
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            class="block px-4 py-2 hover:bg-gray-500  dark:text-gray-400"
                          >
                            Billing
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            class="block px-4 py-2 hover:bg-gray-500  dark:text-gray-400"
                          >
                            Rewards
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <a href="#" class="block px-4 py-2 hover:bg-gray-500 ">
                      Earnings
                    </a>
                  </li>
                </ul>
                <div class="py-1">
                  <a
                    href="#"
                    class="block px-4 py-2 text-sm  hover:bg-gray-500  dark:text-gray-400"
                  >
                    Sign out
                  </a>
                </div>
              </div>
            </li>
            <li>
              <a
                href="#"
                class="block py-2 pl-3 pr-4  rounded hover:bg-gray-500 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#"
                class="block py-2 pl-3 pr-4  rounded hover:bg-gray-500 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#"
                class="block py-2 pl-3 pr-4  rounded hover:bg-gray-500 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
              >
                Contact
              </a>
            </li> */}
          </ul>

          <div class="flex justify-center">
            <button
              data-collapse-toggle="navbar-multi-level"
              type="button"
              class="inline-flex items-center p-2 ml-3 text-sm text-red-500 rounded-lg md:hidden hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-multi-level"
              aria-expanded="false"
            >
              <AiOutlineCloseCircle class="text-3xl" />
            </button>
          </div>
        </div>
        {props.user ? (
          <>
            <button
              type="button"
              class="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom"
            >
              <span class="sr-only">Open user menu</span>
              <img
                class="w-11 h-11 rounded-full"
                src={props.user.user_metadata.picture}
                alt="user photo"
                referrerPolicy="no-referrer"
              />
            </button>
            <div
              class="z-50 hidden my-4 text-base list-none divide-y divide-gray-100 rounded-lg shadow bg-gray-700"
              id="user-dropdown"
            >
              <div class="px-4 py-3">
                <span class="block text-sm text-white">
                  {props.user.user_metadata.name}
                </span>
                <span class="block text-sm font-medium text-gray-500 ">
                  {props.user.user_metadata.email}
                </span>
              </div>
              <ul class="py-2" aria-labelledby="user-menu-button">
                <li>
                  <Link
                    href="/"
                    class="block px-4 py-2 text-sm  hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Home
                  </Link>
                </li>
              </ul>
              <ul class="py-2" aria-labelledby="user-menu-button">
                <li>
                  <Link
                    href="/timeline"
                    class="block px-4 py-2 text-sm  hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Timeline
                  </Link>
                </li>
              </ul>
              <ul class="py-2" aria-labelledby="user-menu-button">
                <li>
                  <button
                    onclick={props.signout}
                    class="block px-4 py-2 text-sm  hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <button
            onclick={props.handleLoginwithGoogle}
            class="block py-2 pl-3 pr-4  rounded hover:bg-gray-500 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
