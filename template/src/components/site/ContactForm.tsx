import { useState } from "react";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { S } from "@/lib/site";

type Errors = Partial<Record<"nom" | "email" | "message", string>>;

/*
  Le formulaire n'envoie rien lui-même : il construit un lien `mailto:`
  pré-rempli et laisse le visiteur envoyer le message depuis sa propre
  messagerie. Aucun service tiers, donc aucune promesse de réception qu'on
  ne pourrait pas tenir.
*/
export default function ContactForm() {
  const [values, setValues] = useState({ nom: "", email: "", tel: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  function validate(): Errors {
    const next: Errors = {};
    if (values.nom.trim().length < 2) next.nom = "Indiquez votre nom.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
      next.email = "Indiquez une adresse e-mail valide.";
    if (values.message.trim().length < 10)
      next.message = "Décrivez votre projet en quelques mots (10 caractères minimum).";
    return next;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.getElementById(`champ-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    const sujet = `Demande de devis : ${values.nom.trim()}`;
    const corps = [
      `Nom : ${values.nom.trim()}`,
      `E-mail : ${values.email.trim()}`,
      values.tel.trim() ? `Téléphone : ${values.tel.trim()}` : null,
      "",
      values.message.trim(),
    ]
      .filter(Boolean)
      .join("\n");
    window.location.href = `mailto:${S.email ?? ""}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
    setSent(true);
  }

  const field =
    "mt-2 w-full rounded-2xl border-0 bg-card px-4 py-3.5 text-[16px] text-ink shadow-[0_1px_2px_hsl(80_20%_10%/0.04)] ring-1 ring-ink/[0.08] transition-quick " +
    "placeholder:text-muted-foreground/60 hover:ring-ink/20 focus:outline-none focus:ring-2 focus:ring-chartreuse-strong";
  const label = "block text-[14px] font-medium tracking-[-0.01em] text-ink";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="champ-nom" className={label}>
          Nom <span aria-hidden="true" className="text-muted-foreground">*</span>
        </label>
        <input
          id="champ-nom"
          name="nom"
          type="text"
          autoComplete="name"
          required
          value={values.nom}
          onChange={set("nom")}
          aria-invalid={!!errors.nom}
          aria-describedby={errors.nom ? "erreur-nom" : undefined}
          className={field}
        />
        {errors.nom && (
          <p id="erreur-nom" role="alert" className="mt-2 text-[13px] text-danger">
            {errors.nom}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="champ-email" className={label}>
            E-mail <span aria-hidden="true" className="text-muted-foreground">*</span>
          </label>
          <input
            id="champ-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={set("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "erreur-email" : undefined}
            className={field}
          />
          {errors.email && (
            <p id="erreur-email" role="alert" className="mt-2 text-[13px] text-danger">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="champ-tel" className={label}>
            Téléphone <span className="font-normal text-muted-foreground">(facultatif)</span>
          </label>
          <input
            id="champ-tel"
            name="tel"
            type="tel"
            autoComplete="tel"
            value={values.tel}
            onChange={set("tel")}
            className={`${field} tabular`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="champ-message" className={label}>
          Votre projet <span aria-hidden="true" className="text-muted-foreground">*</span>
        </label>
        <textarea
          id="champ-message"
          name="message"
          rows={4}
          required
          value={values.message}
          onChange={set("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "erreur-message" : undefined}
          className={`${field} resize-y`}
        />
        {errors.message && (
          <p id="erreur-message" role="alert" className="mt-2 text-[13px] text-danger">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="group inline-flex w-full items-center justify-between gap-3 rounded-full bg-ink py-2.5 pl-6 pr-2.5 text-[16px] font-medium tracking-[-0.01em] text-white transition-smooth hover:bg-chartreuse hover:text-onaccent active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chartreuse-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
      >
        Envoyer la demande
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 group-hover:bg-ink/10"
        >
          <PaperPlaneTilt size={18} weight="regular" />
        </span>
      </button>

      {sent && (
        <p role="status" className="text-[15px] leading-relaxed text-muted-foreground">
          Votre messagerie va s'ouvrir avec le message pré-rempli, il ne restera qu'à l'envoyer.
          Pour aller plus vite, appelez.
        </p>
      )}
    </form>
  );
}
