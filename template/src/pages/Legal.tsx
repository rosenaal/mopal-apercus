import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Reveal from "@/components/site/Reveal";
import { S, href } from "@/lib/site";
import type { PageLegale } from "@/lib/routes";

/* Pages légales (article 6 de la LCEN). Identité : registre SIRENE quand la
   correspondance est sûre ; sinon les lignes restent « à compléter ». */
const H2 = "mt-14 text-[1.5rem] font-semibold tracking-[-0.035em] sm:text-[1.75rem]";
const P = "mt-4 text-[16px] leading-[1.7] text-muted-foreground text-pretty";
const lien = "rounded transition-quick underline decoration-ink/25 underline-offset-4 hover:text-ink hover:decoration-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chartreuse-strong";

function Ligne({ terme, children }: { terme: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-t border-ink/[0.07] py-4 sm:flex-row sm:gap-8">
      <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground sm:w-56 sm:shrink-0 sm:pt-1">{terme}</dt>
      <dd className="text-[16px] leading-relaxed text-ink">{children}</dd>
    </div>
  );
}

const A_COMPLETER = <span className="text-muted-foreground">À compléter</span>;

function Mentions() {
  const r = S.registre;
  const d = S.demo;
  return (
    <>
      <h2 className="text-[1.5rem] font-semibold tracking-[-0.035em] sm:text-[1.75rem]">Éditeur du site</h2>
      <dl className="mt-6">
        <Ligne terme="Éditeur">{r ? <>{r.nom_complet}, {r.forme.toLowerCase()}</> : S.nom}</Ligne>
        <Ligne terme="Enseigne">{S.nom}</Ligne>
        <Ligne terme="Adresse déclarée">{r ? r.siege : A_COMPLETER}</Ligne>
        <Ligne terme="Adresse d'exploitation">{S.adresse.complete}</Ligne>
        <Ligne terme="Téléphone"><a href={`tel:${S.tel.tel}`} className={`tabular ${lien}`}>{S.tel.display}</a></Ligne>
        <Ligne terme="E-mail">{S.email ? <a href={`mailto:${S.email}`} className={`break-all ${lien}`}>{S.email}</a> : A_COMPLETER}</Ligne>
        <Ligne terme="SIREN">{r ? r.siren : A_COMPLETER}</Ligne>
        <Ligne terme="SIRET">{r ? r.siret : A_COMPLETER}</Ligne>
        <Ligne terme="Code APE">{r ? <>{r.ape}, {r.ape_libelle.toLowerCase()}</> : A_COMPLETER}</Ligne>
        <Ligne terme="Immatriculation">Registre national des entreprises (RNE)</Ligne>
        <Ligne terme="Directeur de la publication">{r?.dirigeant ?? A_COMPLETER}</Ligne>
      </dl>

      <h2 className={H2}>Hébergeur</h2>
      <p className={P}>
        Le site est hébergé par {d.hebergeur}, {d.hebergeur_adresse}.{" "}
        <a href={d.hebergeur_url} target="_blank" rel="noopener noreferrer" className={lien}>{d.hebergeur_url.replace(/^https?:\/\//, "")}</a>
      </p>

      <h2 className={H2}>Conception et réalisation</h2>
      <p className={P}>
        Site conçu et réalisé par{" "}
        <a href="https://www.agencemopale.com/" target="_blank" rel="noopener noreferrer" className={lien}>MOPALE</a>.
      </p>

      <h2 className={H2}>Propriété intellectuelle</h2>
      <p className={P}>
        L'ensemble des contenus de ce site, textes, photographies, identité visuelle et code, est protégé par le droit
        d'auteur. Toute reproduction ou représentation, totale ou partielle, sans autorisation écrite préalable, est interdite.
      </p>

      <h2 className={H2}>Responsabilité</h2>
      <p className={P}>
        Les informations publiées sur ce site sont fournies à titre indicatif. Elles ne constituent ni un diagnostic ni un
        engagement contractuel. Seul le devis établi après visite sur place engage {S.nom}.
      </p>

      <h2 className={H2}>Litiges</h2>
      <p className={P}>
        Le présent site est soumis au droit français. En cas de litige avec un consommateur, et après tentative de résolution
        amiable directe, le client peut recourir gratuitement au médiateur de la consommation dont relève l'entreprise,
        conformément à l'article L.616-1 du code de la consommation. Les coordonnées du médiateur sont communiquées sur simple
        demande au <a href={`tel:${S.tel.tel}`} className={`tabular ${lien}`}>{S.tel.display}</a>.
      </p>
    </>
  );
}

function Confidentialite() {
  const r = S.registre;
  const d = S.demo;
  const responsable = r?.dirigeant ?? r?.nom_complet ?? S.nom;
  return (
    <>
      <h2 className="text-[1.5rem] font-semibold tracking-[-0.035em] sm:text-[1.75rem]">Ce site ne collecte aucune donnée</h2>
      <p className={P}>
        Ce site est un site vitrine statique. Il ne comporte ni compte utilisateur, ni espace client, ni base de données. Il
        ne dépose aucun cookie de mesure d'audience, de publicité ou de réseau social, et n'utilise aucun outil de statistiques.
      </p>

      <h2 className={H2}>Le formulaire de contact</h2>
      <p className={P}>
        {S.email
          ? "Le formulaire de demande de devis n'envoie rien à un serveur. Lorsque vous le validez, il ouvre votre propre logiciel de messagerie avec un message pré-rempli, que vous restez libre d'envoyer ou non. Les informations que vous y saisissez ne transitent donc par aucun service tiers et ne sont stockées nulle part sur ce site."
          : "Ce site ne comporte aucun formulaire : le contact se fait par téléphone."}
      </p>
      <p className={P}>
        Si vous appelez le <a href={`tel:${S.tel.tel}`} className={`tabular ${lien}`}>{S.tel.display}</a>
        {S.email ? " ou si vous envoyez un e-mail" : ""}, les informations transmises sont traitées par {responsable} dans le seul
        but de répondre à votre demande et d'établir un devis. Elles ne sont ni cédées ni revendues.
      </p>

      <h2 className={H2}>Responsable du traitement</h2>
      <dl className="mt-6">
        <Ligne terme="Responsable">{responsable}{r ? <>, {r.forme.toLowerCase()}</> : null}, exerçant sous l'enseigne {S.nom}</Ligne>
        <Ligne terme="Adresse déclarée">{r ? r.siege : A_COMPLETER}</Ligne>
        <Ligne terme="Adresse d'exploitation">{S.adresse.complete}</Ligne>
        <Ligne terme="Contact">{S.email ? <a href={`mailto:${S.email}`} className={`break-all ${lien}`}>{S.email}</a> : <a href={`tel:${S.tel.tel}`} className={`tabular ${lien}`}>{S.tel.display}</a>}</Ligne>
      </dl>

      <h2 className={H2}>Hébergement et journaux techniques</h2>
      <p className={P}>
        Le site est hébergé par {d.hebergeur} ({d.hebergeur_adresse}). Comme tout hébergeur, {d.hebergeur} enregistre des journaux
        techniques de connexion, qui peuvent contenir votre adresse IP, à des fins de sécurité et de bon fonctionnement du
        service. Ce transfert hors Union européenne est encadré par les garanties contractuelles prévues par le règlement
        général sur la protection des données.
      </p>

      <h2 className={H2}>Polices de caractères</h2>
      <p className={P}>
        Les polices d'affichage sont servies par le site lui-même. Votre navigateur ne contacte aucun service tiers pour les
        charger, et votre adresse IP n'est transmise à personne à cette occasion.
      </p>

      <h2 className={H2}>Vos droits</h2>
      <p className={P}>
        Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et d'opposition sur les données que
        vous nous auriez transmises. Pour l'exercer, contactez-nous par téléphone{S.email ? " ou par e-mail" : ""}.
      </p>
      <p className={P}>
        Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez adresser une
        réclamation à la Commission nationale de l'informatique et des libertés (CNIL),{" "}
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className={lien}>cnil.fr</a>.
      </p>
    </>
  );
}

export default function Legal({ page }: { page: PageLegale }) {
  const mentions = page === "mentions-legales";
  return (
    <>
      <Navbar base="/" />
      <section id="contenu" className="pb-24 pt-32 sm:pb-32 sm:pt-40 lg:pt-44">
        <div className="container-wide">
          <Reveal className="max-w-[46rem]">
            <nav aria-label="Fil d'Ariane" className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted-foreground">
              <a href={href("/")} className="rounded transition-quick hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chartreuse-strong">Accueil</a>
              <span aria-hidden="true" className="px-2 text-ink/25">/</span>
              <span className="text-ink">{mentions ? "Mentions légales" : "Confidentialité"}</span>
            </nav>
            <h1 className="mt-8 text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.05em] sm:text-[3.25rem]">
              {mentions ? "Mentions légales" : "Politique de confidentialité"}
            </h1>
          </Reveal>
          <Reveal delay={0.08} className="mt-16 max-w-[46rem]">{mentions ? <Mentions /> : <Confidentialite />}</Reveal>
        </div>
      </section>
      <Footer />
    </>
  );
}
