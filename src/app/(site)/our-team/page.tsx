import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getVisibleTeam } from "@/lib/data/public";
import { siteImages } from "@/lib/site-images";

export const metadata = { title: "Our Team" };

const approach = [
  {
    title: "Preparation",
    body: "We coordinate templates, backdrops, and technical details before arrival so your event day stays smooth.",
  },
  {
    title: "Guest support",
    body: "Friendly guidance helps every guest — from camera-shy relatives to enthusiastic dance-floor crews — feel confident in front of the lens.",
  },
  {
    title: "Styling",
    body: "Our setups are designed to complement your venue with modern-retro materials and clean, editorial lines.",
  },
  {
    title: "On-site technical assistance",
    body: "Professional lighting, DSLR capture, and attentive troubleshooting keep the booth running while you host.",
  },
];

export default async function OurTeamPage() {
  const team = await getVisibleTeam();

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink/5 bg-porcelain py-20">
        <Image
          src={siteImages.outdoorGazebo}
          alt=""
          fill
          className="object-cover object-right opacity-30"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <Reveal>
            <h1 className="font-display text-5xl">Our approach</h1>
            <p className="mt-4 max-w-2xl text-taupe">
              Captured.YXE is built around thoughtful preparation and warm guest experiences — on every event we
              support.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8 grid md:grid-cols-2 gap-8">
          {approach.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.06}>
              <article className="rounded-3xl border border-ink/10 p-8 h-full">
                <h2 className="font-display text-2xl">{a.title}</h2>
                <p className="mt-3 text-sm text-taupe leading-relaxed">{a.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {team.length > 0 ? (
        <section className="bg-ink py-20 text-porcelain">
          <div className="mx-auto max-w-7xl px-4 md:px-8 grid gap-8 md:grid-cols-3">
            {team.map((member) => (
              <article key={member._id} className="rounded-2xl bg-porcelain/5 p-6">
                {member.imageUrl && (
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                    <Image src={member.imageUrl} alt={member.name} fill className="object-cover" />
                  </div>
                )}
                <h3 className="font-display text-2xl">{member.name}</h3>
                <p className="text-champagne text-sm">{member.role}</p>
                {member.biography && <p className="mt-3 text-sm text-porcelain/80">{member.biography}</p>}
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="py-16 border-t border-ink/10">
          <div className="mx-auto max-w-xl px-4 text-center text-sm text-taupe">
            Team profiles will be published here once approved names, photos, and biographies are provided.
          </div>
        </section>
      )}

      <section className="py-20 text-center">
        <ButtonLink href="/booking">Work with us</ButtonLink>
      </section>
    </>
  );
}
