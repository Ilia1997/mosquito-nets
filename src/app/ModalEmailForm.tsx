import { sendEmail } from "@/app/actions";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import React from "react";

const ModalEmailForm = ({
  message,
  setOpen,
  open,
}: {
  message: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}) => {
  const [phone, setPhone] = React.useState("");
  const [name, setName] = React.useState("");
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/60 data-[state=open]:animate-overlayShow" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray1 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow bg-gray-50">
          {!isSubmitted ? (
            <>
              {" "}
              <AlertDialog.Title className="m-0 text-[17px] font-semibold text-gray-700 mb-5">
                Оставить заявку на расчет
              </AlertDialog.Title>
              <form>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Имя
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Телефон
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="+373 *** *****"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  />
                </div>
              </form>
              <div className="flex justify-end gap-[25px]">
                <button
                  onClick={async () => {
                    // make inputs validation
                    if (name.trim() === "" || phone.trim() === "") {
                      alert("Пожалуйста, заполните все поля.");
                      return;
                    }
                    await sendEmail({ message, name, phone });
                    setIsSubmitted(true);
                  }}
                  className="inline-flex h-[35px] items-center justify-center rounded bg-gray-700 px-[15px] font-medium leading-none text-white outline-none outline-offset-1 hover:bg-red5 focus-visible:outline-2 focus-visible:outline-green-300"
                >
                  Отправить
                </button>
              </div>
            </>
          ) : (
            <>
              <AlertDialog.Title className="m-0 text-[17px] font-medium text-gray-700">
                Спасибо!
              </AlertDialog.Title>
              <AlertDialog.Description className="mb-5 mt-[15px] text-[15px] leading-normal text-gray-600">
                Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.
              </AlertDialog.Description>
              <div className="flex justify-end gap-[25px]">
                <AlertDialog.Action asChild>
                  <button className="inline-flex h-[35px] items-center justify-center rounded bg-gray-700 px-[15px] font-medium leading-none text-white outline-none outline-offset-1 hover:bg-red5 focus-visible:outline-2 focus-visible:outline-green-300">
                    Закрыть
                  </button>
                </AlertDialog.Action>
              </div>
            </>
          )}
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default ModalEmailForm;
