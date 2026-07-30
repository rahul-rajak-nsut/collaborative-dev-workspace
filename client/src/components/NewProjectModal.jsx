import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  description: z.string().max(200).optional(),
});

function NewProjectModal({ onClose, onCreate }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    await onCreate(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <p className="text-[var(--color-text)] text-sm">
            <span className="text-[var(--color-accent)]">$</span> new_project
            <span className="text-[var(--color-accent)] cursor-blink">_</span>
          </p>
          <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5">
          <div className="mb-4">
            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5">
              <span className="text-[var(--color-accent)]">$</span> name
            </label>
            <input
              autoFocus
              {...register("name")}
              className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-3 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition"
              placeholder="my-awesome-project"
            />
            {errors.name && (
              <p className="text-[var(--color-danger)] text-xs mt-1">// {errors.name.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5">
              <span className="text-[var(--color-accent)]">$</span> description (optional)
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-3 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition resize-none"
              placeholder="what is this project for?"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[var(--color-accent-warm)] hover:bg-[var(--color-accent-warm-hover)] disabled:opacity-50 rounded py-2.5 text-sm font-medium text-[var(--color-text)] transition"
            >
              {isSubmitting ? "creating..." : "run create()"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition"
            >
              cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewProjectModal;