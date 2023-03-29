import {
  Component,
  For,
  Show,
  createEffect,
  createResource,
  createSignal,
  Setter,
  onCleanup,
  createMemo,
} from "solid-js";
import {
  Routes,
  useParams,
  Route,
  Router,
  Link,
  useNavigate,
} from "@solidjs/router";

import Navbar from "./components/Navbar";
import { createClient, User } from "@supabase/supabase-js";
import { SolidApexCharts } from "solid-apexcharts";

const supabase = createClient(
  import.meta.env.VITE_PROJECT_URL,
  import.meta.env.VITE_ANON_KEY
);

import { FiDelete, FiEdit, FiXCircle } from "solid-icons/fi";
import { FaRegularCircleDown } from "solid-icons/fa";
import "flowbite";

const App: Component = () => {
  const [userData, setUserData] = createSignal<User | null>(null);
  async function handleLoginwithGoogle() {
    await supabase.auth
      .signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("userData", res.data.url!);
        if (res.error) console.log(res.error.message);
      });
  }

  async function signout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error.message);
    }
  }

  createEffect(() => {
    const { data: authSession } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(event);

        setUserData(session?.user ?? null);
      }
    );

    onCleanup(() => authSession.subscription.unsubscribe());
  });
  return (
    <Router>
      <Navbar
        user={userData()}
        handleLoginwithGoogle={handleLoginwithGoogle}
        signout={signout}
      />
      <div class="container min-h-screen mx-auto">
        <Routes>
          <Route path={"/"} component={TaskList} />
          <Route path={"/insert"} component={TaskForm} />
          <Route path={"/insert/:id"} component={TaskForm} />
          <Route path={"/timeline"} component={TimelineChart} />
          <Route
            path={"/invitations"}
            element={
              <InvitationLink handleLoginwithGoogle={handleLoginwithGoogle} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

const TaskList: Component = () => {
  const [currentId, setCurrentId] = createSignal(0);

  const [showDeleteModal, setShowDeleteModal] = createSignal(false);
  const [taskPreview, setTaskPreview] = createSignal({ name: "", image: "" });

  async function getTasks() {
    return (await supabase.from("tasks").select("*").order("deadline")).data;
  }
  const [tasks, { refetch }] = createResource(getTasks);
  async function getSingleTask(id: number) {
    return (
      await supabase
        .from("tasks")
        .select("*")
        .eq("id", Number(id))
        .maybeSingle()
    ).data;
  }

  async function handleeDeleteTask() {
    const imageURL = (await getSingleTask(currentId()))?.image.split("/");
    const imageName = imageURL[imageURL.length - 1];

    const { error: errorStorage } = await supabase.storage
      .from("files")
      .remove(["image/" + imageName]);

    if (errorStorage) {
      console.log(errorStorage);
      return false;
    }

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", Number(currentId()));
    if (error) {
      console.log(error.message);
    }
    if (!error && !errorStorage) {
      setCurrentId(0);
      setShowDeleteModal(false);
      refetch();
    }
  }

  return (
    <div>
      <Link href="/insert">
        <div class="relative mx-7 my-5 inline-flex items-center justify-center p-0.5 mr-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
          <span class="relative px-5 py-2.5 transition-all ease-in duration-75  bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Insert New Task
          </span>
        </div>
      </Link>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-300">
          <thead class="text-gray-500 text-md uppercase">
            <tr>
              <th scope="col" class="px-6 py-3">
                <span class="sr-only">Image</span>
              </th>
              <th scope="col" class="px-6 py-3">
                Task
              </th>
              <th scope="col" class="px-6 py-3">
                Start At
              </th>
              <th scope="col" class="px-6 py-3">
                Deadline
              </th>
              <th scope="col" class="px-6 py-3">
                Descriptions
              </th>
              <th scope="col" class="px-6 py-3"></th>
              <th scope="col" class="px-6 py-3"></th>
              <th scope="col" class="px-6 py-3">
                Status
              </th>
              <th scope="col" class="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <For each={tasks()} fallback={<p>Loading...</p>}>
              {(i) => (
                <tr class="border-b bg-gray-800 dark:border-gray-700 hover:dark:hover:bg-gray-600">
                  <td colspan={1} class="md:p-4">
                    <button
                      onclick={() =>
                        setTaskPreview({ name: i.name, image: i.image })
                      }
                    >
                      <img
                        class="md:w-32 w-full"
                        src={i.image}
                        loading="lazy"
                        alt="Apple Watch"
                      />
                    </button>
                  </td>
                  <td colspan={1} class="px-6 py-4 font-semibold text-white">
                    {i.name}
                  </td>
                  <td class="px-6 py-4 font-semibold text-white">
                    {i.startline}
                  </td>
                  <td class="px-6 py-4 font-semibold text-white">
                    {i.deadline}
                  </td>
                  <td
                    colspan={3}
                    class="px-6 py-4 font-semibold text-white max-w-md"
                  >
                    {i.description.substring(0, 75)}
                  </td>
                  <td colspan={1} class="px-6 py-4 font-semibold text-white">
                    {i.isDone ? <p>Completed</p> : <p>Uncompleted</p>}
                  </td>
                  <td colspan={1} class="px-6 py-4">
                    <button
                      onClick={() => setCurrentId(i.id)}
                      class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                      type="button"
                    >
                      <span class="relative px-5 py-2.5 transition-all ease-in duration-75  bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Action
                      </span>
                    </button>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>

        <Show when={taskPreview().image}>
          <div class="fixed top-0 left-0 flex justify-center items-center right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-screen">
            <div class="relative w-full h-screen max-w-2xl flex justify-center items-center">
              <div class="relative flex justify-center items-center flex-col rounded-lg shadow bg-gray-700">
                <div class="flex items-center w-full justify-between p-4 border-b rounded-tborder-gray-600">
                  <h3 class="text-xl font-semibold text-white">
                    {taskPreview().name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setTaskPreview({ name: "", image: "" })}
                    class="text-gray-400 bg-transparent  rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white"
                  >
                    <FiXCircle class="text-3xl" />
                    <span class="sr-only">Close modal</span>
                  </button>
                </div>

                <img
                  class="max-h-[85vh]"
                  src={taskPreview().image}
                  alt="previewmodalimage"
                />
                <button
                  type="button"
                  onClick={() => setTaskPreview({ name: "", image: "" })}
                  class="text-red-700 opacity-50 absolute bottom-1/4 bg-transparent  rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:opacity-100"
                >
                  <FiXCircle class="text-5xl text-red-900" />
                  <span class="sr-only">Close modal</span>
                </button>
              </div>
            </div>
          </div>
        </Show>
      </div>

      <Show when={currentId()}>
        <TaskOptionModal
          setCurrentId={setCurrentId}
          id={currentId()}
          setShowDeleteModal={setShowDeleteModal}
        />
      </Show>
      <Show when={showDeleteModal()}>
        <DeleteModal
          handleDelete={handleeDeleteTask}
          setShowDeleteModal={setShowDeleteModal}
        />
      </Show>
    </div>
  );
};

const TaskForm: Component = () => {
  const { id } = useParams();
  const [name, setName] = createSignal("");
  const [image, setImage] = createSignal<File | null>(null);
  const [isDone, setIsDone] = createSignal(false);
  const [startline, setStartline] = createSignal("");
  const [deadline, setDeadline] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [imagePreview, setImagePreview] = createSignal<
    string | ArrayBuffer | null
  >("");

  const naviate = useNavigate();

  const [onHoverState, setOnHoverState] = createSignal(false);

  async function handleSubmit() {
    if (id) {
      await handleUpdateTask().then(() => naviate("/"));
    }
    if (!id) {
      await handleInsertTask().then(() => naviate("/"));
    }
  }

  async function handleInsertTask() {
    if (!image()?.name) {
      return false;
    }

    if (image()?.name) {
      const imageName = new Date().getTime() + "_" + image()?.name!;

      const { data: dataStorge, error: errorStorage } = await supabase.storage
        .from("files")
        .upload("image/" + imageName, image(), {
          cacheControl: "3600",
          upsert: false,
        });

      if (errorStorage) {
        console.log(errorStorage);
        return false;
      }
      const body = {
        name: name(),
        description: description(),
        image: `https://pohxmpugtevrqaifxnmn.supabase.co/storage/v1/object/public/files/${dataStorge.path}`,
        isDone: false,
        startline: startline(),
        deadline: deadline(),
      };

      const { error, data } = await supabase.from("tasks").insert({ ...body });
      if (error) {
        console.log(error);
        return false;
      }
      console.log(data);
    }
  }

  async function handleUpdateTask() {
    if (!image()?.name) {
      const body = {
        name: name(),
        description: description(),
        isDone: isDone(),
        startline: startline(),
        deadline: deadline(),
      };

      const { error, data } = await supabase
        .from("tasks")
        .update({ ...body })
        .match({ id: Number(id) });
      if (error) {
        console.log(error);
        return false;
      }
      console.log(data);
    }

    if (image()?.name) {
      const imageURL = (await getTasks()).data?.image.split("/");
      const imageName = imageURL[imageURL.length - 1];

      const { data: dataStorge, error: errorStorage } = await supabase.storage
        .from("files")
        .update("image/" + imageName, image(), {
          cacheControl: "3600",
          upsert: false,
        });

      if (errorStorage) {
        console.log(errorStorage);
        return false;
      }
      const body = {
        name: name(),
        description: description(),
        image: `https://pohxmpugtevrqaifxnmn.supabase.co/storage/v1/object/public/files/${dataStorge.path}`,
        isDone: isDone(),
        startline: startline(),
        deadline: deadline(),
      };

      const { error, data } = await supabase
        .from("tasks")
        .update({ ...body })
        .match({ id: Number(id) });
      if (error) {
        console.log(error);
        return false;
      }
      console.log(data);
    }
  }

  function handleInputImage(file: FileList | undefined | null) {
    if (!file) {
      console.log("File undefine");
      return false;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file[0]);
    };
    reader.onerror = (err) => {
      console.log(err);
    };
  }

  async function getTasks() {
    return await supabase
      .from("tasks")
      .select("*")
      .eq("id", Number(id))
      .maybeSingle();
  }

  const [task] = createResource(id, getTasks);

  createEffect(() => {
    if (task()?.data) {
      setName(task()?.data?.name);
      setDescription(task()?.data?.description);
      setStartline(task()?.data?.startline);
      setDeadline(task()?.data?.deadline);
      setIsDone(task()?.data?.isDone);
      setImagePreview(task()?.data!.image);
    }
  });

  return (
    <div class="max-w-3xl mx-auto px-3">
      <div class="mb-6">
        <form
          onsubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div>
            <label for="default-input" class="block my-3 text-sm font-medium">
              Name
            </label>
            <input
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              type="text"
              placeholder="Input task name..."
              id="default-input"
              class="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div>
            <label for="message" class="block my-3 text-sm font-medium">
              Description
            </label>
            <textarea
              value={description()}
              onInput={(e) => setDescription(e.currentTarget.value)}
              id="message"
              rows="4"
              class="block p-2.5 w-full text-sm rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write description for task here..."
            ></textarea>
          </div>
          <div>
            <label for="default-input" class="block my-3 text-sm font-medium">
              Image
            </label>
            <div class="flex items-center justify-center w-full my-3">
              <label
                for="dropzone-file"
                class="flex p-7 flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer dark:hover:bg-bray-800 bg-gray-700 hover:bg-gray-100 dark:border-gray-500 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <Show when={!imagePreview()}>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setOnHoverState(true);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleInputImage(e.dataTransfer?.files);
                    }}
                    onDragLeave={() => setOnHoverState(false)}
                    class={`${
                      onHoverState()
                        ? "border-4 border-dashed text-gray-200 border-blue-500"
                        : null
                    } flex w-full h-full flex-col items-center justify-center pt-5 pb-6`}
                  >
                    <svg
                      aria-hidden="true"
                      class="w-10 h-10 mb-3 "
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p class="mb-2 text-sm text-center">
                      <span class="font-semibold">Click to upload</span> or drag
                      and drop image file
                    </p>
                    <p class="text-xs text-center">
                      SVG, PNG, JPG or GIF (MAX. 2Mb)
                    </p>
                  </div>
                </Show>
                <Show when={imagePreview()}>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setOnHoverState(true);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleInputImage(e.dataTransfer?.files);
                    }}
                    onDragLeave={() => setOnHoverState(false)}
                    class={`${
                      onHoverState()
                        ? "border-4 border-dashed text-gray-200 border-blue-500"
                        : null
                    } flex w-full h-full flex-col items-center justify-center pt-5 pb-6`}
                  >
                    <img
                      class="h-full w-auto"
                      src={imagePreview() as string}
                      alt="previewiupload"
                    />
                  </div>
                </Show>
                <input
                  onInput={(e) => handleInputImage(e.currentTarget?.files)}
                  type="file"
                  id="dropzone-file"
                  class="hidden"
                />
              </label>
            </div>
          </div>
          <div>
            <label for="default-input" class="block my-3 text-sm font-medium">
              Start At
            </label>
            <input
              value={startline()}
              onInput={(e) => setStartline(e.currentTarget.value)}
              type="date"
              id="date-input"
              class=" border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div>
            <label for="default-input" class="block my-3 text-sm font-medium">
              Deadline
            </label>
            <input
              value={deadline()}
              onInput={(e) => setDeadline(e.currentTarget.value)}
              type="date"
              id="date-input"
              class=" border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <Show when={id}>
            <div class="flex items-center my-3">
              <input
                checked={isDone()}
                onInput={() => setIsDone((current) => !current)}
                id="default-checkbox"
                type="checkbox"
                value=""
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 bg-gray-700 dark:border-gray-600"
              />
              <label for="default-checkbox" class="ml-2 text-base font-medium">
                Is Done
              </label>
            </div>
          </Show>

          <div class="w-full flex justify-between my-12">
            <Link href="/">
              <button class="relative my-3 text-white inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                <span class="relative w-32 py-2.5 transition-all ease-in duration-75  bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  Back
                </span>
              </button>
            </Link>
            <button
              type="submit"
              class="relative my-3 text-white inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
            >
              <span class="relative w-32 px-5 py-2.5 transition-all ease-in duration-75  bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Submit
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TaskOptionModal: Component<{
  id: number;
  setCurrentId: Setter<number>;
  setShowDeleteModal: Setter<boolean>;
}> = (props) => {
  return (
    <div
      tabindex="-1"
      onClick={() => props.setCurrentId(0)}
      class="fixed top-0 left-0 right-0 flex justify-center items-center z-50 bg-black bg-opacity-30 w-full p-4 overflow-x-hidden overflow-y-auto h-[calc(100%-1rem)] md:h-full"
    >
      <div class="relative w-full max-w-xs h-auto">
        <div class="relative  rounded-lg shadow bg-gray-700 py-3">
          <Link href={"/insert/" + props.id}>
            <div class="flex justify-center gap-7 items-center text-lg hover: font-medium rounded-md py-2 mx-2">
              <FiEdit class="text-xl" />
              <button class="w-32 rounded" type="button">
                Edit
              </button>
            </div>
          </Link>
          <div
            onClick={(e) => {
              props.setShowDeleteModal(true);
              e.stopPropagation();
            }}
            class="flex justify-center gap-7 items-center text-lg hover: font-medium rounded-md py-2 mx-2"
          >
            <FiDelete class="text-xl" />
            <button class="w-32 rounded" type="button">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteModal: Component<{
  handleDelete(): Promise<false | undefined>;
  setShowDeleteModal: Setter<boolean>;
}> = (props) => {
  return (
    <div
      tabindex="-1"
      class="fixed flex items-center justify-center top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto inset-0 h-full"
    >
      <div class="relative w-full max-w-md md:h-auto">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button
            type="button"
            onclick={() => props.setShowDeleteModal(false)}
            class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-hide="popup-modal"
          >
            <svg
              aria-hidden="true"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <div class="p-6 text-center">
            <svg
              aria-hidden="true"
              class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 class="mb-5 text-lg font-normal text-gray-500">
              Are you sure you want to delete this task?
            </h3>
            <button
              onclick={props.handleDelete}
              data-modal-hide="popup-modal"
              type="button"
              class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
            >
              Yes, I'm sure
            </button>
            <button
              onclick={() => props.setShowDeleteModal(false)}
              data-modal-hide="popup-modal"
              type="button"
              class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InvitationLink: Component<{ handleLoginwithGoogle(): Promise<void> }> = (
  props
) => {
  return (
    <div class="h-screen flex items-center justify-center">
      <button
        onclick={props.handleLoginwithGoogle}
        class="relative animate-bounce inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
      >
        <span class="relative text-xl px-20 pb-2 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0">
          Login
          <FaRegularCircleDown class="text-center text-3xl mx-auto mt-3" />
        </span>
      </button>
    </div>
  );
};

const TimelineChart: Component = () => {
  async function getTasks() {
    return (await supabase.from("tasks").select("*").order("deadline")).data;
  }
  const [tasks] = createResource(getTasks);

  function timelineFormater() {
    const timeLineList: Array<{ x: string; y: Array<any>; fillColor: string }> =
      [];
    tasks()?.forEach((i, n) => {
      timeLineList.push({
        x: i.name,
        y: [new Date(i.startline).getTime(), new Date(i.deadline).getTime()],
        fillColor:
          "#" + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, "0"),
      });
    });

    return timeLineList;
  }

  const series = createMemo(() => {
    const series = [
      {
        data: timelineFormater(),
      },
    ];

    return series;
  }, timelineFormater());

  console.log(window.innerWidth);
  return (
    <div class="text-black overflow-x-auto">
      <SolidApexCharts
        type="rangeBar"
        class="text-black"
        height={500}
        width={
          window.innerWidth > 1025
            ? "100%"
            : window.innerWidth > 480
            ? "125%"
            : "250%"
        }
        options={{
          chart: {
            id: "timeline",
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          xaxis: {
            type: "datetime",
            labels: {
              style: {
                colors: [],
                fontSize: "12px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 400,
                cssClass: "apexcharts-xaxis-label",
              },
            },
          },
        }}
        series={series()}
      />
    </div>
  );
};
