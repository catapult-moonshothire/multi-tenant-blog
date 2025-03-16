import Header from "@/components/landing/header";
import RegistrationForm from "@/components/registration-form";

export default function page() {
  return (
    <>
      <Header hideButton />
      <div className="flex p-4 justify-center items-center h-[90vh]">
        <RegistrationForm />
      </div>
    </>
  );
}
