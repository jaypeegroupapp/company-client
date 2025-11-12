"use client";

import { useRef, startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { registerCompanyAction } from "@/actions/company";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import { CompanyFormData, companyFormSchema } from "@/validations/company"; // ✅ fixed import
import { companyInputFormData } from "@/constants/company";

const CompanyForm = () => {
  type ActionState = {
    message: string;
    errors: Record<string, string | string[]>;
  };
  const initialState: ActionState = { message: "", errors: {} };

  const [state, formAction, isPending] = useActionState(
    registerCompanyAction,
    initialState
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyName: "",
      registrationNumber: "",
      contactEmail: "",
      contactPhone: "",
      billingAddress: "",
      vatNumber: "",
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex h-screen items-center justify-center bg-white text-black">
      <motion.form
        ref={formRef}
        onSubmit={(evt) => {
          evt.preventDefault();
          handleSubmit(() => {
            const formData = new FormData(formRef.current!);
            startTransition(() => formAction(formData));
          })(evt);
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white text-black rounded-3xl md:shadow-2xl md:border md:border-gray-300 p-8 w-full max-w-md md:max-w-sm"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Company Details
        </h2>

        {companyInputFormData.map((input) => (
          <InputValidated
            key={input.name}
            {...input}
            register={register}
            errors={errors}
            stateError={state?.errors}
            isPending={isPending}
          />
        ))}

        {/* ✅ File Upload */}
        <div className="flex flex-col mb-4">
          <label
            htmlFor="invoiceFile"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Upload Last Invoice
          </label>
          <input
            type="file"
            name="invoiceFile"
            id="invoiceFile"
            className="w-full text-black file:mr-3 file:py-2 file:px-4 file:rounded-full 
                       file:border-0 file:bg-black file:text-white hover:file:bg-gray-800 
                       bg-gray-100 rounded-full p-1 focus:outline-none"
          />
        </div>
        {state?.errors && (
          <p className="text-red-600 text-center text-sm mt-3">
            {(() => {
              const errs = state.errors as Record<string, string | string[]>;
              const err = errs?.["invoiceFile"];
              return Array.isArray(err) ? err[0] : err ?? "";
            })()}
          </p>
        )}

        <SubmitButton name="Save Company Details" isPending={isPending} />
      </motion.form>
    </div>
  );
};

export default CompanyForm;
