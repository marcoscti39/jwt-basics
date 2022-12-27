import React, { useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import Notification from "./components/Notification";
import { fetchPremiumData } from "./fetch/fetchPremiumData";
import { postUser } from "./fetch/userPost";
import { useNotification } from "./hooks/useNotification";

export interface UserTypes {
  name: string;
  password: string;
}

const App = () => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [passwordValue, setPasswordValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const mutationUser = useMutation(postUser);
  const mutationPremiumData = useMutation(fetchPremiumData);
  const { activateNotification, notificationPayload, showNotification } =
    useNotification();

  const handleLoginUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newUser = {
      name: nameInputRef.current?.value!,
      password: passwordValue,
    };
    mutationUser.mutate(newUser);
  };

  const handleFetchWithJWT = () => {
    mutationPremiumData.mutate(localStorage.getItem("accessKey")!);
  };
  useEffect(() => {
    if (!mutationUser.isLoading) {
      if (mutationUser.data?.message) {
        localStorage.setItem("accessKey", mutationUser.data.accessKey);
        activateNotification({
          message: mutationUser.data.message,
          type: mutationUser.data.type,
        });
      }
    }
  }, [mutationUser.isLoading]);

  useEffect(() => {
    if (!mutationPremiumData.isLoading) {
      if (mutationPremiumData.data?.message) {
        activateNotification({
          message: mutationPremiumData.data.message,
          type: mutationPremiumData.data.type,
        });
      }
    }
  }, [mutationPremiumData.isLoading]);
  return (
    <>
      <section className="flex flex-col items-center">
        <form
          className="flex flex-col gap-6 bg-white w-[600px] rounded p-6 mt-12 shadow-sm"
          onSubmit={handleLoginUser}
        >
          <h1 className="text-center font-semibold text-2xl">Login/Register</h1>

          <div className="flex flex-col">
            <span>Username</span>
            <input
              type="text"
              aria-label="your username"
              className="py-1 bg-gray-100 text-lg indent-2"
              ref={nameInputRef}
            />
          </div>

          <div className="flex flex-col">
            <span>Password</span>
            <div className="flex flex-col relative">
              <input
                type="password"
                aria-label="your password"
                className="py-1 bg-gray-100 text-lg indent-2"
                onInput={(e) => setPasswordValue(e.currentTarget.value)}
                value={passwordValue}
              />
              {showPassword && (
                <span className="flex items-center bg-gray-100 w-full h-full absolute pointer-events-none pl-2">
                  {passwordValue}
                </span>
              )}
            </div>

            <div className="flex gap-2 items-center mt-4">
              <input
                type="checkbox"
                aria-label="show password"
                onChange={() => setShowPassword(!showPassword)}
              />
              <span>show password</span>
            </div>
          </div>

          <button
            type="submit"
            className="bg-purple-600 rounded px-4 py-2 flex-1 text-white"
          >
            Submit
          </button>
          {showNotification && <Notification {...notificationPayload} />}
        </form>
      </section>
      <section className="flex flex-col gap-4 mx-auto w-[600px] mt-4">
        <h2 className="text-center font-semibold text-2xl">Dashboard</h2>
        {localStorage.getItem("accessKey") ? (
          <span className="text-green-500 text-center">Token Provided</span>
        ) : (
          <span className="text-red-600 text-center">Token not Provided</span>
        )}

        <div className="bg-white p-2 w-full">
          {mutationPremiumData?.data &&
            mutationPremiumData?.data?.type === "success" && (
              <p>
                Hello {mutationPremiumData?.data?.premiumData?.name} <br />
                {mutationPremiumData?.data?.premiumData?.content}
              </p>
            )}
        </div>

        <button
          className="bg-purple-600 text-white rounded py-2"
          onClick={handleFetchWithJWT}
        >
          Get Data
        </button>
      </section>
    </>
  );
};

export default App;
