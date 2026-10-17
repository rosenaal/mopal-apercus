import { Phone, EnvelopeSimple, Clock, MapPin, ArrowUpRight } from "@phosphor-icons/react";
import ContactForm from "./ContactForm";
import ButtonLink from "./Button";
import Reveal from "./Reveal";
import { Crosshair } from "./Reticle";
import { S } from "@/lib/site";

const label = "flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground";
const lien = "rounded-lg transition-quick hover:text-chartreuse-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chartreuse-strong focus-visible:ring-offset-4 focus-visible:ring-offset-card";

/* Une seule grande coque : coordonnées à gauche (l'appel d'abord), demande
   de devis par e-mail à droite. Sans e-mail public, le formulaire laisse la
   place à un rappel de la fiche Google et des horaires. */
export default function Contact() {
  const c = S.contact;
  return (
    <section id="contact" className="section-y">
      <div className="container-wide">
        <Reveal className="max-w-3xl">
          <p className="eyebrow"><Crosshair className="h-3.5 w-3.5 text-chartreuse-strong" />Contact</p>
          <h2 className="mt-7 h2-display">{c.h2} <span className="text-ink/50">{c.h2_soft}</span></h2>
          <p className="mt-8 max-w-[34rem] text-[18px] leading-[1.65] text-muted-foreground text-pretty">{c.texte}</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-16 sm:mt-20">
          <div className="bezel">
            <div className="bezel-core grid gap-2 p-2 lg:grid-cols-12">
              <div className="flex flex-col p-5 sm:p-8 lg:col-span-5 lg:p-10">
                <div>
                  <p className={label}><Phone size={14} weight="light" aria-hidden="true" />Téléphone</p>
                  <a href={`tel:${S.tel.tel}`} className={`tabular mt-3 inline-block text-[2.5rem] font-semibold leading-none tracking-[-0.05em] sm:text-[3.25rem] ${lien}`}>{S.tel.display}</a>
                  <div className="mt-6"><ButtonLink href={`tel:${S.tel.tel}`} icon={Phone} variant="accent">Appeler maintenant</ButtonLink></div>
                </div>
                <dl className="mt-12 divide-y divide-ink/[0.07] border-t border-ink/[0.07] lg:mt-auto">
                  {S.email && (
                    <div className="py-5">
                      <dt className={label}><EnvelopeSimple size={14} weight="light" aria-hidden="true" />E-mail</dt>
                      <dd className="mt-2"><a href={`mailto:${S.email}`} className={`break-all text-[17px] font-medium tracking-[-0.01em] ${lien}`}>{S.email}</a></dd>
                    </div>
                  )}
                  {S.horaires.length > 0 && (
                    <div className="py-5">
                      <dt className={label}><Clock size={14} weight="light" aria-hidden="true" />Horaires</dt>
                      <dd className="mt-2">
                        <table className="w-full text-[15px]"><tbody>
                          {S.horaires.map((h) => (
                            <tr key={h.jours}>
                              <th scope="row" className="py-1 pr-4 text-left font-normal text-muted-foreground">{h.jours}</th>
                              <td className="tabular py-1 text-right font-mono text-[14px] text-ink">{h.heures}</td>
                            </tr>
                          ))}
                        </tbody></table>
                      </dd>
                    </div>
                  )}
                  <div className="pt-5">
                    <dt className={label}><MapPin size={14} weight="light" aria-hidden="true" />Adresse</dt>
                    <dd className="mt-2 text-[15px] text-ink">{S.adresse.complete}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-[calc(2rem-0.875rem)] bg-background p-5 ring-1 ring-ink/[0.05] sm:p-8 lg:col-span-7 lg:p-10">
                {S.email ? (
                  <>
                    <h3 className="text-[1.75rem] font-semibold tracking-[-0.04em]">Demande de devis</h3>
                    <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted-foreground text-pretty">{c.form_intro}</p>
                    <div className="mt-8"><ContactForm /></div>
                  </>
                ) : (
                  <div className="flex h-full flex-col justify-between gap-10">
                    <div>
                      <h3 className="text-[1.75rem] font-semibold tracking-[-0.04em]">Un chantier à décrire ?</h3>
                      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted-foreground text-pretty">{c.form_intro}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <ButtonLink href={`tel:${S.tel.tel}`} icon={Phone} variant="solid" size="lg" className="tabular">{S.tel.display}</ButtonLink>
                      <ButtonLink href={S.maps_url} icon={ArrowUpRight} variant="ghost" size="lg" external>Voir la fiche Google</ButtonLink>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
