import { useId } from "react";
import { Input } from "../Input";
import { Label } from "../label";

type ListOfErrors = Array<string | null | undefined> | null | undefined;

function ErrorMessage({ id, errors }: { errors?: ListOfErrors; id?: string }) {
  const errorsToRender = errors?.filter(Boolean);
  if (!errorsToRender?.length) return null;
  return (
    <p className="text-sm text-red-600" id={id}>
      {errorsToRender[0]}
    </p>
  );
}

function FormField({
  labelProps,
  inputProps,
  errors,
  className,
}: {
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  errors?: ListOfErrors;
  className?: string;
}) {
  const fallbackId = useId();
  const id = inputProps.id ?? fallbackId;
  const errorId = errors?.length ? `${id}-error` : undefined;
  return (
    <div>
      <div className={className}>
        <Label htmlFor={id} {...labelProps} />
        <Input
          id={id}
          aria-invalid={errorId ? true : undefined}
          aria-describedby={errorId}
          {...inputProps}
        />
      </div>
      {errorId ? (
        <div className="mt-1">
          <ErrorMessage id={errorId} errors={errors} />
        </div>
      ) : null}
    </div>
  );
}

export { FormField };
